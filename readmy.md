## Технологии
- jest
- testing-library
- secure-ls - шифруем данные для хранения в local storage
- react-i18next (lang + backend)
- axios (interceptor)
- bootstrap
- routing https://reactrouter.com/en/main/start/tutorial
- регистрация - после `signUp` приходит ссылка (см. консоль), по которой нужной перейти, чтобы
активировать аккаунт (`user: user100`, `pass: user100U`);  также при логине токен сохраняется
в `localstorage` и передается через `Bearer`

---
## Запускаем фронт и бэк
- front:
> npm run start
- back-end:
> npm run start-mem
> 
> npm run start-stored

---
## Создание проекта

>  npx create-react-app  name-project

`npx` - не бужет ставить глобально пакет create-react-app для создания проекта


---
## React
- react обновляет шаблон при изменении `state`
- Ф-я `withTranslation` от `i18next` является **HOC** 



---
## HOC

```
const SignUpPageWithTranslation =  withTranslation()(SignUpPage);

export default SignUpPageWithTranslation;
```
В дереве компонентов мы сможем увидеть наш HOC компонент, который пробрасывает
пропсы для самого компонента (оборачиваемого).

### custom HOC

**HOC** - ф-я принимающая компонент и возвращающая новый компонент
с расширенной функциональностью. Обычно HOC компонента начинаются с
приставки `with`

- custom HOOK - `withHover.js`
- Пример: `export default withHover(LangSelector);`

---
### Вместо HOC воспользуемся hook

```
const LangSelector = () => {
    // use hook instead HOC
    const {i18n} = useTranslation()

    return (            
        <span onClick={() => {
            i18n.changeLanguage('ru');
        }} title='Rus'>Ru</span>
    )
}

export default LangSelector;
```

## useRef и кастомный hook 

- `useRef` - получаем доступ к DOM элементу. пример использования - \src\components\LangSelector.jsx
- `кастомный hook` - \src\hooks\useHover.js (пример использования -  `LangSelector`)

## Цель и HOOK и HOC

Цель и HOOK и HOC вынести повторяющуюся функциональность из компонентов.



## React Fragment
> <></>

## React and WS
`React pallete`  - инструментария для создания снипетов на реакте. 


## Пример роутинга:
[react-router-6-tutorial (john smilga)](https://github.com/john-smilga/react-router-6-tutorial/blob/main/src/final/pages/SharedLayout.js
)



---
## links
- [bootstrap](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [mswjs.io](https://mswjs.io/)




---
## proxy

package.json
>`"proxy": "http://localhost:8080"`

Теперь, если клиент не найдет `root`, произойдет редирект на `endpoint` выше.
И в тесте нам не придется прописывать полный путь.

Также в браузере мы избавились от дополнительного запроса `CROSS ORIGIN - OPTIONS`,
т.к. теперь запрос проксируется и идет на локальный сервер.


## State

Для хранения состояния проекта существует несколько подходов:
- **lifting state** (используем `useState` на верхнем компоненте и используем `props`, чтобы пробросить нужный `cb`, например,
  `setLoggedIn`)  в дочерние компоненты
-  **Props drilling** - пробрасываем через пропсы, включая промежуточные компоненты



```
const [auth, setAuth] = useState({
    isLoggedIn: false,
    id: ''
});

<Route path="/login" element={<LoginPage onLoginSuccess={setAuth} />} />    
```
- **Context API** : `createContext` - создаем `state`, \
  **Context API**  подходит когда state не сложный и обновляется нечасто. В остальных случаях подходит REDUX.


`AuthContext.Provider` - оборачиваем все дочерние компоненты для кот требуется данный `state`
  `AuthContext.Consumer` - получаем контекст или как альтернатива можем (И **ДОЛЖНЫ**) использовать
`useContext`:


```
  <AuthContext.Provider value={{
      isLoggedIn: false,
      id: ''
  }}>
    ALL CHILD COMPONENTS
  </AuthContext.Provider>
           
           
         
 export const NavBar = (props) => {
    return (
        <AuthContext.Consumer>
            {(auth) => {
                return CONTENT_CHILD_COMPONENT
            }}
    )
 }
 
 // OR (получаем контекст)
 const auth = useContext(AuthContext)
                    
// IMPORTANT!!! 
// Делаем привязку к state, чтобы при изменении state происходил rerender               
function App() {
    const [auth, setAuth] = useState({
        isLoggedIn: false,
        id: ''
    });

    return (
        <>
            <AuthContext.Provider value={{
                isLoggedIn: auth.isLoggedIn,
                id: auth.id,
                onLoginSuccess: setAuth
            }}>      
                    ALL CHILD COMPONENTS
                    
```

Плюс можно создать как отдельный компонент, который будет в роли wrapper - `AuthContextWrapper`, чтобы 
вынести в обертку useState, createContext

- **REDUX**

[redux.js.org](https://redux.js.org/) \
![redux](C:\Users\denz\Desktop\notes\img\react\redux.png "")

### Основные концепции Redux:
- `reducer` - для обработки `actions` и модификации `state`
- `store` =  `state` + `reducer`; `store` имеет метод `subscribe` - _whenever store is changed_;
- `useSelector` - получаем данные из store state
- `connect` - получаем данные (альтернатива `useSelector`) но через HOC, для class-компонент
- `useDispatch` - хук для отправки `actions`, эмиттер


---
## Тесты

---
### setupTests.js

setupTests - используется для настройки тестов и jest чекает этот файл
перед запуском каждого тест-модуля. Поэтому в нем мы можем использовать общую функ-ть,
например, `forEach`:

```
import '@testing-library/jest-dom';
import {act} from '@testing-library/react';
import i18n from './locale/i18n';

afterEach(() => {
    act(() => {
        i18n.changeLanguage('en')
    })
})
```




---
### Создадим mock функция для axios.post

> source/src/SignUpPage/SignUpPage.spec.js

```
const button = screen.queryByRole('button', {name: 'Sign Up'});

const mockFn = jest.fn();
axios.post = mockFn; // mock

userEvent.click(button);

const firstCallOfMockFunction = mockFn.mock.calls[0]; // first call
const body = firstCallOfMockFunction[1]; // second param (body) axios.post
expect(body).toEqual({
    username: 'user1',
    email: 'user1@mail.com',
    password: 'P4ssword'
});
```


---
### Mocking and Mock Service Worker (MSW)

У нас могут быть разная реализация в запросах - мы можем использовать как
`fetch` так и `axios`, чтобы сделать общий `mock` используют **MSW** -
[mswjs.io](https://mswjs.io/).

> npm i --save-dev msw

```
it('sends username, email and password to backend after clicking the button',  async () => {
    let requestBody;
    
    // setup server
    const server = setupServer(
        rest.post('/api/1.0/users', (req, res, ctx) => {
            requestBody = req.body;
            return res(ctx.status(200));
        })
    );
    server.listen();

    render(<SignUpPage/>);

    //...
       
    const button = screen.queryByRole('button', {name: 'Sign Up'});
    
    userEvent.click(button);
    // wait request
    await new Promise(resolve => setTimeout(resolve, 500));
    
    expect(requestBody).toEqual({
        username: 'user1',
        email: 'user1@mail.com',
        password: 'P4ssword'
    });
})
```

---
### Тестирование асинхронного эл-та в DOM

Так как элемент с успешной регистрацией появляется после запроса, то для выборки данного эл-та
воспользуемся методом `findBy` , который поддерживает `Await`: 

[react-testing-library/cheatsheet](https://testing-library.com/docs/react-testing-library/cheatsheet/)



---
### Реализуем событие - клик на dom-элементе

```
const rusToggle = screen.getByTitle('Rus');
userEvent.click(rusToggle);
```


---
### Дожидаемся окончания асинхронного запроса

Так как мы уже создали моковый сервер, то чтобы дожаться окончания запроса мы можем использовать
конструкцию `await screen.findByText`, которая ждет момента появления текста во вьюхи.


```
it('disables button when there is an ongoing api call', async () => {
    setup();
    userEvent.click(button);
    userEvent.click(button);

    await screen.findByText('Please check your e-mail to activate your account');

    expect(counter).toBe(1); 
})
```

---
### waitFor

`waitFor` - ожидаем, когда наш expect выполнится [waitFor](https://testing-library.com/docs/dom-testing-library/api-async/#waitfor)

```
it('hides sign up from after successful sign up request', async () => {
    setup();
    const form = screen.getByTestId("form-sign-up")
    userEvent.click(button);
    await waitFor(() => {
        expect(form).not.toBeInTheDocument();
    });
    // await waitForElementToBeRemoved(form);
})
```

---
### Перезаписываем запрос на сервер
Хотя мы и определили запрос над всеми тестами, 
в самом тесте мы можем переопределить поведение запроса (и обрабатывать сообщение, кот
прошло с бэка):
```
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
```

Не забываем сбрасывать запросы:
```
beforeEach(() => {
    server.resetHandlers();
});
```


---
### Тест на основе пропсов + наличие класса (css)

```
it('has is-invalid class for input when help is set', () => {
    const {container} = render(<Input help="Error message"/>);
    const input = container.querySelector('input');
    expect(input.classList).toContain('is-invalid');
})

it('has invalid-feedback class for span when help is set ', () => {
    const {container} = render(<Input help="Error message"/>);
    const span = container.querySelector('span');
    expect(span.classList).toContain('invalid-feedback');
})
```


---
### Однотипные тесты в JEST
Для одинаковых тестов (например, валидация контролов) в
JEST мы можем использовать метод test.each, передавай параметры для каждого теста:


```
it.each`
field           | message
${'username'}   | ${'Username cannot be null'}
${'email'}      | ${'E-mail cannot be null'}
`("displays validation $messages for $field", async (testFields) => {
    const {field, message} = testFields;
    server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => {
            return res(ctx.status(400), ctx.json({
                validationErrors: {
                    [field]: message
                }
            }));
        })
    );
    setup();
    userEvent.click(button);
    const validationError = await screen.findByText(message);
    expect(validationError).toBeInTheDocument();
})
```

**Эквивалентно** нескольким однотипным тестам:

```
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

it('displays validation messages for email ', async () => {
    server.use(
        rest.post('/api/1.0/users', (req, res, ctx) => {
            return res(ctx.status(400), ctx.json({
                validationErrors: {
                    email: 'E-mail cannot be null'
                }
            }));
        })
    );
    setup();
    userEvent.click(button);
    const validationError = await screen.findByText('E-mail cannot be null');
    expect(validationError).toBeInTheDocument();
});

```


---
### ByLabelText

По `label` находим ассоциированный с ним элемент

[ByLabelText](https://testing-library.com/docs/queries/bylabeltext/)

Нашли `input` и сгенерировали событие type со значением `updated`:
```
userEvent.type(screen.getByLabelText(label), 'updated');
```


---
### Тест на изменения текста по клику (валидация на фронте)
```
it('displays password mismatch validation in Rus', () => {
    setup();

    // выборка кнопки
    const rusToggle = screen.getByTitle('Rus');
    // вызываем событие клик
    userEvent.click(rusToggle);

    // выборка текстового поля
    const passwordInput = screen.getByLabelText(ru.password);
    // вызываем событие type - печатаем текст в поле
    userEvent.type(passwordInput, "P4ss");

    // выборка элемента с нужным текстом
    const validationMessageInRus = screen.queryByText(ru.passwordMismatchValidation);
    expect(validationMessageInRus).toBeInTheDocument();
});
```


---
### waitForElementToBeRemoved

- `waitForElementToBeRemoved` - асинхронно дожидаемся удаления элемента на странице

```
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
```

---
### Тест на роутинг (наличие компонента на стр.)
```
it('displays homepage at /', () => {
    render(<App/>)
    const homePage = screen.getByTestId('home-page');
    expect(homePage).toBeInTheDocument();
})
```

см. `App.js` для более подробного анализа.



---
### Тест на наличие элемента в DOM (getByRole)


```
<div>
    <a href="/">Home</a>
</div>
```
```
it('has link to homepage on NavBar', () => {
    setup('/');
    const link = screen.getByRole('link', {name: 'Home'})
    expect(link).toBeInTheDocument();
})
```

---
### Реализуем клик событие посредством userEvent

```
const link = screen.getByRole('link', {name: 'Sign Up'});
userEvent.click(link);
expect(screen.getByTestId('signup-page')).toBeInTheDocument();
```


---
### Тест на получение токена (`mockReturnValue` для возврата значения из функции, `jest.fn().mockReturnValue`)
- создадим в тесте фейк-й сервер
- замокаем ф-ю `useParams` модуля '`react-router-dom`'  -  `*2`
- протест-м удачный, неудачный запрос и сам запрос


```
let counter = 0;

const server = setupServer(
    rest.post('/api/1.0/users/token/:token',
        (req, res, ctx) => {
        if (req.params.token === '5678') {
            return res(ctx.status(400))
        }

        counter += 1;
        return res(ctx.status(200));
    })
);

beforeEach(() => {
    counter = 0;
    server.resetHandlers();
});

beforeAll(() => server.listen());
afterAll(() => server.close());

const mockUseParams = jest.fn().mockReturnValue({        // *2
    token: '1234',
});

// mock the module using the mock function created above
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => mockUseParams(),
}));

describe('Account Activation Page', () => {
    const setup = () => {
        render(<BrowserRouter><AccountActivationPage /></BrowserRouter>);
    }

    it('displays activation success message when token is correct', async () => {
        mockUseParams.mockReturnValueOnce({
            token: '1234',
        });
        setup();
        const message = await screen.findByText('Account is activated');
        expect(message).toBeInTheDocument();
    })

    it('sends activation request to backend', async () => {
        mockUseParams.mockReturnValueOnce({
            token: '1234',
        });
        setup();
        await screen.findByText('Account is activated');
        expect(counter).toBe(1); // чекаем запрос прошел
    })

    it('displays activation failure message when token is invalid', async () => {
        mockUseParams.mockReturnValueOnce({
            token: '5678',
        });
        setup();
        const message = await screen.findByText('Activation failure');
        expect(message).toBeInTheDocument();
    })
})
```

---
http://localhost:8080/api/1.0/users - список юзеров


### Мок запроса

Мок запроса, который происходит в компоненте `UserList`

```
// мок запроса
const server = setupServer(
    rest.get('/api/1.0/users',
        (req, res, ctx) => {
            return res(ctx.status(200), ctx.json(page1));
        })
);
```


### Тест с запросом непосредственно в тесте

```
    it('stores id, username and image in storage', async () => {
        server.use(
            rest.post('/api/1.0/auth',
                (req, res, ctx) => {
                    return res(
                        ctx.status(200),
                        ctx.json({
                            id: 5,
                            username: 'user5',
                            image: null
                        })
                    );
                })
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

});
```


