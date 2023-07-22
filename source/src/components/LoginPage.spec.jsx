import {render, screen, waitForElementToBeRemoved} from '../test/setup';
import {LoginPage} from './LoginPage';
import userEvent from '@testing-library/user-event';
import {setupServer} from 'msw/node';
import {rest} from 'msw';
import en from '../locale/en.json';
import ru from '../locale/ru.json';
import storage from '../state/storage';

let requestBody, count, acceptLanguageHeader;
const server = setupServer(
    rest.post('/api/1.0/auth',
        (req, res, ctx) => {
            count += 1;
            requestBody = req.body;
            acceptLanguageHeader = req.headers.get('Accept-Language');
            return res(
                ctx.status(401),
                ctx.json({message: "Incorrect credentials"})
            );
        })
);

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedUsedNavigate,
}));

beforeEach(() => {
    count = 0;
    server.resetHandlers();
    mockedUsedNavigate.mockReset()
});

beforeAll(() => server.listen());
afterAll(() => server.close());

const loginSuccess = rest.post('/api/1.0/auth',
    (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.json({
                id: 5,
                username: 'user5',
                image: null,
                token: 'abcdefgh'
            })
        );
    })

describe('Login Page', () => {
    describe('layout', () => {
        it('has header', () => {
            render(<LoginPage/>);
            const header = screen.queryByRole('heading', {name: 'Login'});
            expect(header).toBeInTheDocument();
        });
        it('has email input  ', () => {
            render(<LoginPage/>);
            const input = screen.getByLabelText('email');
            expect(input).toBeInTheDocument();
        });
        it('has password input  ', () => {
            render(<LoginPage/>);
            const input = screen.getByLabelText('password');
            expect(input).toBeInTheDocument();
        });
        it('has password type for password input  ', () => {
            render(<LoginPage/>);
            const input = screen.getByLabelText('password');
            expect(input.type).toBe('password');
        });

        it('has Login button', () => {
            render(<LoginPage/>);
            const button = screen.queryByRole('button', {name: 'Login'});
            expect(button).toBeInTheDocument();
        });
        it('disables the button initially', () => {
            render(<LoginPage/>);
            const button = screen.queryByRole('button', {name: 'Login'});
            expect(button).toBeDisabled();
        });
    })
    describe('Interactions', () => {
        let inputEmail, inputPassword, button;

        const setup = (email = 'user100@email.com') => {
            render(<LoginPage/>);
            inputEmail = screen.getByLabelText('email');
            inputPassword = screen.getByLabelText('password');
            userEvent.type(inputEmail, email);
            userEvent.type(inputPassword, 'P4ssword');
            button = screen.queryByRole('button', {name: 'Login'});
        }

        it('enables the button when email and password inputs are filled ', () => {
            setup();
            expect(button).toBeEnabled();
        });

        it('displays spinner api call ', async () => {
            setup();
            expect(screen.queryByRole('status')).not.toBeInTheDocument();
            userEvent.click(button);
            const spinner = screen.getByRole('status');
            await waitForElementToBeRemoved(spinner);
        });

        it('sends email and password after clicking the button ', async () => {
            setup();
            userEvent.click(button);
            const spinner = screen.getByRole('status');
            await waitForElementToBeRemoved(spinner);
            expect(requestBody).toEqual({
                email: 'user100@email.com',
                password: 'P4ssword'
            });
        });

        it('disables the button when is an api call', async () => {
            setup();
            userEvent.click(button);
            userEvent.click(button);
            const spinner = screen.getByRole('status');
            await waitForElementToBeRemoved(spinner);
            expect(count).toEqual(1);
        });

        it('displays authentication fail message', async () => {
            setup();
            userEvent.click(button);
            const errorMessage = await screen.findByText('Incorrect credentials');
            expect(errorMessage).toBeInTheDocument();
        });

        it('clear authentication fail message when password field is changed', async () => {
            setup();
            userEvent.click(button);
            const errorMessage = await screen.findByText('Incorrect credentials');
            userEvent.type(inputPassword, 'user@email.com')
            expect(errorMessage).not.toBeInTheDocument();
        });

        it('stores id, username and image in storage', async () => {
            server.use(
                loginSuccess
            );
            setup('user5@mail.com');
            userEvent.click(button);
            const spinner = screen.getByRole('status');
            await waitForElementToBeRemoved(spinner);
            const storedState = storage.getItem('auth');
            const objectFields = Object.keys(storedState)
            expect(objectFields.includes('id')).toBeTruthy();
            expect(objectFields.includes('image')).toBeTruthy();
        });

        it('stores authorization header value is storage', async () => {
            server.use(
                loginSuccess
            );
            setup('user5@mail.com');
            userEvent.click(button);
            const spinner = screen.getByRole('status');
            await waitForElementToBeRemoved(spinner);
            const storedState = storage.getItem('auth');
            expect(storedState.header).toBe('Bearer abcdefgh');
        });
    });


    describe('Internationalization', () => {

        let rusToggle, engToggle;

        const setup = () => {
            render(<>
                <LoginPage/>
            </>);
            rusToggle = screen.getByTitle('Rus');
            engToggle = screen.getByTitle('Eng');
        }

        it('initially displays all text in English', () => {
            setup();
            expect(screen.queryByRole('heading', {name: en.login})).toBeInTheDocument();
            expect(screen.queryByRole('button', {name: en.login})).toBeInTheDocument();
            expect(screen.getByLabelText(en.password)).toBeInTheDocument();
            expect(screen.getByLabelText(en.email)).toBeInTheDocument();
        });

        it('displays all text in Rus after changing the language', () => {
            setup();
            userEvent.click(rusToggle);
            expect(screen.queryByRole('heading', {name: ru.login})).toBeInTheDocument();
            expect(screen.getByLabelText(ru.email)).toBeInTheDocument();
            expect(screen.getByLabelText(ru.password)).toBeInTheDocument();
        });

        it('sets accept language header to en for outgoing request', async () => {
            setup();
            const inputEmail = screen.getByLabelText('email');
            const inputPassword = screen.getByLabelText('password');
            userEvent.type(inputEmail, 'user100@email.com');
            userEvent.type(inputPassword, 'P4ssword');
            const button = screen.queryByRole('button', {name: 'Login'});
            userEvent.click(button);
            const spinner = screen.getByRole('status');
            await waitForElementToBeRemoved(spinner);
            expect(acceptLanguageHeader).toBe('en');
        });

        it('sets accept language header to rus for outgoing request', async () => {
            setup();
            const inputEmail = screen.getByLabelText('email');
            const inputPassword = screen.getByLabelText('password');
            userEvent.type(inputEmail, 'user100@email.com');
            userEvent.type(inputPassword, 'P4ssword');
            const button = screen.queryByRole('button', {name: 'Login'});
            userEvent.click(rusToggle);
            userEvent.click(button);
            const spinner = screen.getByRole('status');
            await waitForElementToBeRemoved(spinner);
            expect(acceptLanguageHeader).toBe('ru');
        });
    })
})
