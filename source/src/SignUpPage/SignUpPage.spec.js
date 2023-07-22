import SignUpPage from './SignUpPage';
import {render, screen, waitFor, act, waitForElementToBeRemoved} from '../test/setup';
import userEvent from '@testing-library/user-event';
import {setupServer} from 'msw/node';
import {rest} from 'msw';
import i18n from '../locale/i18n';
import en from '../locale/en.json';
import ru from '../locale/ru.json';
import LangSelector from '../components/LangSelector';

let requestBody;
let counter = 0;
let acceptLanguageHeader;
const server = setupServer(
    rest.post('/api/1.0/users', (req, res, ctx) => {
        requestBody = req.body;
        counter += 1;
        acceptLanguageHeader = req.headers.get('Accept-Language');
        return res(ctx.status(200));
    })
);

beforeEach(() => {
    counter = 0;
    server.resetHandlers();
});

beforeAll(() => server.listen());
afterAll(() => server.close());


describe('Sign Up Page', () => {
    describe('layout', () => {
        it('has header', () => {
            render(<SignUpPage/>);
            const header = screen.queryByRole('heading', {name: 'Sign Up'});
            expect(header).toBeInTheDocument();
        });
        it('has username input  ', () => {
            render(<SignUpPage/>);
            const input = screen.getByLabelText('username');
            expect(input).toBeInTheDocument();
        });
        it('has email input  ', () => {
            render(<SignUpPage/>);
            const input = screen.getByLabelText('email');
            expect(input).toBeInTheDocument();
        });
        it('has password input  ', () => {
            render(<SignUpPage/>);
            const input = screen.getByLabelText('password');
            expect(input).toBeInTheDocument();
        });
        it('has password type for password input  ', () => {
            render(<SignUpPage/>);
            const input = screen.getByLabelText('password');
            expect(input.type).toBe('password');
        });

        it('has password repeat input  ', () => {
            render(<SignUpPage/>);
            const input = screen.getByLabelText('repeat');
            expect(input).toBeInTheDocument();
        });
        it('has password  type for password repeat input  ', () => {
            render(<SignUpPage/>);
            const input = screen.getByLabelText('repeat');
            expect(input.type).toBe('password');
        });
        it('has sign up button', () => {
            render(<SignUpPage/>);
            const button = screen.queryByRole('button', {name: 'Sign Up'});
            expect(button).toBeInTheDocument();
        });
        it('disables the button initially', () => {
            render(<SignUpPage/>);
            const button = screen.queryByRole('button', {name: 'Sign Up'});
            expect(button).toBeDisabled();
        });
    })
    describe('Interactions', () => {
        let button, inputPassword, inputRepeat, inputUsername, inputEmail;
        const message = 'Please check your e-mail to activate your account';
        const setup = () => {
            render(<SignUpPage/>);
            inputUsername = screen.getByLabelText('username');
            inputEmail = screen.getByLabelText('email');
            inputPassword = screen.getByLabelText('password');
            inputRepeat = screen.getByLabelText('repeat');

            userEvent.type(inputUsername, 'user1'); // trigger event
            userEvent.type(inputEmail, 'user1@mail.com');
            userEvent.type(inputPassword, 'P4ssword');
            userEvent.type(inputRepeat, 'P4ssword');
            button = screen.queryByRole('button', {name: 'Sign Up'});
        }

        it('enable the button when password and password repeat fields have same value', () => {
            setup();
            expect(button).toBeEnabled();
        })

        it('sends username, email and password to backend after clicking the button', async () => {
            setup();
            userEvent.click(button);

            await screen.findByText(message);

            expect(requestBody).toEqual({
                username: 'user1',
                email: 'user1@mail.com',
                password: 'P4ssword',
                passwordRepeat: 'P4ssword'
            });
        })

        it('disables button when there is an ongoing api call', async () => {
            setup();
            userEvent.click(button);
            userEvent.click(button);

            await screen.findByText(message);
            expect(counter).toBe(1);
        })

        it('displays the spinner after clicking submit', async () => {
            setup();
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
            userEvent.click(button);
            const spinner = screen.getByRole('status');
            expect(spinner).toBeInTheDocument();
            await screen.queryByText(message)
        })

        it('does not display spinner when there is no api request', () => {
            setup();
            const spinner = screen.queryByRole('status')
            expect(spinner).not.toBeInTheDocument();
        })

        it('displays account activation notification after successful sign up request', async () => {
            setup();
            expect(screen.queryByText(message)).not.toBeInTheDocument();
            userEvent.click(button);
            const text = await screen.findByText(message);
            expect(text).toBeInTheDocument();
        })

        it('hides sign up from after successful sign up request', async () => {
            setup();
            const form = screen.getByTestId("form-sign-up")
            userEvent.click(button);
            await waitFor(() => {
                expect(form).not.toBeInTheDocument();
            });
            // OR
            // await waitForElementToBeRemoved(form);
        })

        it('displays validation messages for username ', async () => {
            server.use(
                rest.post('/api/1.0/users', (req, res, ctx) => {
                    return res(ctx.status(400), ctx.json({
                        validationErrors: {
                            username: 'Username cannot be null'
                        }
                    }));
                })
            );
            setup();
            userEvent.click(button);
            const validationError = await screen.findByText('Username cannot be null');
            expect(validationError).toBeInTheDocument();
        });

        const generateValidationError = (field, message) => {
            return rest.post('/api/1.0/users', (req, res, ctx) => {
                return res(ctx.status(400), ctx.json({
                    validationErrors: {
                        [field]: message
                    }
                }));
            })
        }

        it('hides spinner and enables button after response received', async () => {
            server.use(
                generateValidationError('username', 'Username cannot be null')
            );
            setup();
            userEvent.click(button);
            await screen.findByText('Username cannot be null');
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
            expect(button).toBeEnabled();
        });


        it.each`
            field           | message
            ${'username'}   | ${'Username cannot be null'}
            ${'email'}      | ${'E-mail cannot be null'}
            ${'password'}   | ${'Password cannot be null'}
        `("displays validation $messages for $field", async (testFields) => {
            const {field, message} = testFields;
            server.use(
                generateValidationError(field, message)
            );
            setup();
            userEvent.click(button);
            const validationError = await screen.findByText(message);
            expect(validationError).toBeInTheDocument();
        })

        it('displays mismatch message for password repeat input', () => {
            setup();
            userEvent.type(inputPassword, 'P4ssword');
            userEvent.type(inputRepeat, 'AnotherP4ssword');

            const validationError = screen.queryByText('Password mismatch');
            expect(validationError).toBeInTheDocument();
        });

        it.each`
            field           | message                           | label
            ${'username'}   | ${'Username cannot be null'}      | ${'username'}
            ${'email'}      | ${'E-mail cannot be null'}        | ${'email'}
            ${'password'}   | ${'Password cannot be null'}      | ${'password'}
        `('clears validation errors after $field  is updated', async ({field, message, label}) => {
            server.use(
                generateValidationError(field, message)
            );
            setup();
            userEvent.click(button);
            const validationError = await screen.findByText(message);
            userEvent.type(screen.getByLabelText(label), 'updated');
            expect(validationError).not.toBeInTheDocument();
        });

    })

    describe('Internationalization', () => {

        let rusToggle, engToggle, passwordInput, passwordInputRepeat;

        const setup = () => {
            render(<>
                <SignUpPage/>
            </>);
            rusToggle = screen.getByTitle('Rus');
            engToggle = screen.getByTitle('Eng');
            passwordInput = screen.getByLabelText(en.password);
            passwordInputRepeat = screen.getByLabelText(en.repeat);
        }

        it('initially displays all text in English', () => {
            setup();
            expect(screen.queryByRole('heading', {name: en.signUp})).toBeInTheDocument();
            expect(screen.getByLabelText(en.username)).toBeInTheDocument();
            expect(screen.getByLabelText(en.email)).toBeInTheDocument();
            expect(screen.getByLabelText(en.password)).toBeInTheDocument();
            expect(screen.getByLabelText(en.repeat)).toBeInTheDocument();
        });
        it('displays all text in Rus after changing the language', () => {
            setup();
            userEvent.click(rusToggle);
            expect(screen.queryByRole('heading', {name: ru.signUp})).toBeInTheDocument();
            expect(screen.getByLabelText(ru.username)).toBeInTheDocument();
            expect(screen.getByLabelText(ru.email)).toBeInTheDocument();
            expect(screen.getByLabelText(ru.password)).toBeInTheDocument();
            expect(screen.getByLabelText(ru.repeat)).toBeInTheDocument();
        });

        it('displays all text in Eng after changing back from Rus', () => {
            setup();
            userEvent.click(engToggle);
            expect(screen.queryByRole('heading', {name: en.signUp})).toBeInTheDocument();
            expect(screen.getByLabelText(en.username)).toBeInTheDocument();
            expect(screen.getByLabelText(en.email)).toBeInTheDocument();
            expect(screen.getByLabelText(en.password)).toBeInTheDocument();
            expect(screen.getByLabelText(en.repeat)).toBeInTheDocument();
        });


        it('displays password mismatch validation in Rus', () => {
            setup();
            userEvent.click(rusToggle);
            const passwordInput = screen.getByLabelText(ru.password);
            userEvent.type(passwordInput, "P4ss");
            const validationMessageInRus = screen.queryByText(ru.passwordMismatchValidation);
            expect(validationMessageInRus).toBeInTheDocument();
        });

        it('sends accept language header as en for outgoing request', async () => {
            setup();
            userEvent.type(passwordInput, 'P4ssword')
            userEvent.type(passwordInputRepeat, 'P4ssword')
            const button = screen.getByRole('button', {name: en.signUp})
            const form = screen.getByTestId("form-sign-up");
            userEvent.click(button);
            await waitForElementToBeRemoved(form);
            expect(acceptLanguageHeader).toBe('en'); // because by default english
        });


        it('sends accept language header as ru for outgoing request after selecting ru language', async () => {
            setup();
            userEvent.type(passwordInput, 'P4ssword')
            userEvent.type(passwordInputRepeat, 'P4ssword')
            const button = screen.getByRole('button', {name: en.signUp});
            userEvent.click(rusToggle); // change language
            const form = screen.getByTestId("form-sign-up");
            userEvent.click(button);
            await waitForElementToBeRemoved(form);
            expect(acceptLanguageHeader).toBe('ru');
        });


    })
});


