import {render, screen} from '../test/setup';
import {AccountActivationPage} from './AccountActivationPage';
import {setupServer} from 'msw/node';
import {rest} from 'msw';

let counter = 0;

const server = setupServer(
    rest.post('/api/1.0/users/token/:token',
        (req, res, ctx) => {
            counter += 1;
            if (req.params.token === '5678') {
                return res(ctx.status(400))
            }
            return res(ctx.status(200));
        })
);

beforeEach(() => {
    counter = 0;
    server.resetHandlers();
});

beforeAll(() => server.listen());
afterAll(() => server.close());

const mockUseParams = jest.fn().mockReturnValue({
    token: '1234',
});

// mock the module using the mock function created above
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => mockUseParams(),
}));


describe('Account Activation Page', () => {
    const setup = () => {
        render(<AccountActivationPage/>);
    }

    it('displays activation success message when token is correct', async () => {
        mockUseParams.mockReturnValue({
            token: '1234',
        });
        setup();
        const message = await screen.findByText('Account is activated');
        expect(message).toBeInTheDocument();
    })

    it('sends activation request to backend', async () => {
        mockUseParams.mockReturnValue({token: '1234',});
        setup();
        await screen.findByText('Account is activated');
        expect(counter).toBe(1); // чекаем запрос прошел
    })

    it('displays activation failure message when token is invalid', async () => {
        mockUseParams.mockReturnValue({
            token: '5678',
        });
        setup();
        const message = await screen.findByText('Activation failure');
        expect(message).toBeInTheDocument();
    })

    it('sends activation request after the token is changed', async () => {
        mockUseParams.mockReturnValue({token: '1234',});
        const {rerender} = render(<AccountActivationPage/>);
        await screen.findByText('Account is activated');
        mockUseParams.mockReturnValue({token: '5678',});
        rerender(<AccountActivationPage/>)
        await screen.findByText('Activation failure');
        expect(counter).toBe(2);
    })

    it('displays spinner during activation api call', async () => {
        mockUseParams.mockReturnValue({
            token: '5678',
        });
        setup();
        const spinner = screen.queryByRole('status');
        expect(spinner).toBeInTheDocument()
        await screen.findByText('Activation failure');
        expect(spinner).not.toBeInTheDocument()
    })

    it('displays spinner after second api call to the changed token', async () => {
        mockUseParams.mockReturnValue({
            token: '1234',
        });
        const {rerender} = render(<AccountActivationPage/>);
        await screen.findByText('Account is activated');
        mockUseParams.mockReturnValue({
            token: '5678',
        });
        rerender(<AccountActivationPage/>)
        const spinner = screen.queryByRole('status');
        expect(spinner).toBeInTheDocument()
        await screen.findByText('Activation failure');
        expect(spinner).not.toBeInTheDocument()
    })

})






