describe('E2E тестирование stellar burgers', () => {
  const clearState = () => {
    cy.clearCookies();
    cy.clearLocalStorage();
  };

  const setupIngredients = () => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
  };

  const visitPage = () => {
    cy.visit('/');
  };

  describe('Тестирование модальных окон ингредиентов', () => {
    beforeEach(() => {
      clearState();
      setupIngredients();
      visitPage();

      cy.get('#modals')
        .as('modalContainer')
        .children()
        .should('have.length', 0);
      cy.get('[data-ingredient="bun"]').first().as('selectedBun');
      cy.get('@selectedBun').click();
      cy.get('#modals').as('modalContainer');
    });

    describe('Открытие модального окна ингредиента', () => {
      it('Модальное окно сохраняется после перезагрузки', () => {
        cy.reload(true);
        cy.get('@modalContainer').children().should('have.length', 2);
      });

      it('Модальное окно отображает правильный ингредиент', () => {
        cy.fixture('ingredients.json').then((data) => {
          const bun = data.data.find(
            (item: { type: string }) => item.type === 'bun'
          );
          cy.get('@modalContainer')
            .find('[data-testid="ingredient-name"]')
            .should('contain', bun.name);
        });
      });
    });

    describe('Закрытие модального окна ингредиента', () => {
      it('Закрытие через "крестик"', () => {
        cy.get('@modalContainer').find('[type="button"]').click();
        cy.get('@modalContainer').children().should('have.length', 0);
      });

      it('Закрытие через клик по оверлэю', () => {
        cy.get('@modalContainer')
          .find('div:nth-child(2)')
          .click({ force: true, multiple: true });
        cy.get('@modalContainer').children().should('have.length', 0);
      });

      it('Закрытие через клавишу Esc', () => {
        cy.get('body').type('{esc}');
        cy.get('@modalContainer').children().should('have.length', 0);
      });
    });
  });

  describe('Оформление заказа', () => {
    beforeEach(() => {
      clearState();

      cy.setCookie('accessToken', 'access-token');
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'refresh-token');
      });

      cy.intercept('GET', '/api/auth/user', { fixture: 'user.json' }).as(
        'fetchUser'
      );
      cy.intercept('POST', 'api/orders', { fixture: 'order' });
      cy.intercept('GET', '/api/ingredients', {
        fixture: 'ingredients.json'
      }).as('fetchIngredients');

      visitPage();
      cy.wait('@fetchUser');
      cy.wait('@fetchIngredients');

      cy.get('[data-ingredient="bun"]:first-of-type button')
        .as('bunButton')
        .click();
      cy.get('[data-ingredient="main"]:first-of-type button')
        .as('mainButton')
        .click();
      cy.get('[data-ingredient="sauce"]:first-of-type button')
        .as('sauceButton')
        .click();

      cy.get('[data-testid="burger-constructor"] [data-testid="top-bun"]')
        .children()
        .should('have.length', 1);
      cy.get('[data-testid="burger-constructor"] [data-testid="bottom-bun"]')
        .children()
        .should('have.length', 1);
      cy.get('[data-testid="burger-constructor"] ul:first-of-type')
        .children()
        .should('have.length', 2);

      cy.get('[data-testid="order-button"]').as('orderButton').click();

      cy.get('#modals').as('modalContainer');
    });

    afterEach(() => {
      clearState();
    });

    it('Авторизованный пользователь может создать заказ', () => {
      cy.get('@modalContainer').children().should('exist');

      cy.get('body').type('{esc}');

      cy.get(
        '[data-testid="burger-constructor"] [data-testid="top-bun"]'
      ).should('not.exist');
      cy.get(
        '[data-testid="burger-constructor"] [data-testid="bottom-bun"]'
      ).should('not.exist');
      cy.get(
        '[data-testid="burger-constructor"] ul:first-of-type [data-testid="main-ingredient"]'
      ).should('not.exist');
    });

    it('Модальное окно отображает корректный номер заказа', () => {
      cy.fixture('order.json').then((data) => {
        const orderId = data.order.number;
        cy.get('@modalContainer').should('contain', orderId);
      });
    });
  });

  describe('Добавление ингредиентов в бургер', () => {
    beforeEach(() => {
      cy.clearCookies();
      cy.clearLocalStorage();
      cy.intercept('GET', 'api/ingredients', {
        fixture: 'ingredients.json'
      }).as('fetchIngredients');
      cy.visit('/');
      cy.wait('@fetchIngredients');
    });

    it('Ингредиент добавляется в конструктор', () => {
      cy.fixture('ingredients.json').then((data) => {
        const mainItem = data.data.find(
          (item: { type: string }) => item.type === 'main'
        );

        cy.get('[data-ingredient="main"]').first().find('button').click();
        cy.get('[data-testid="burger-constructor"] ul:first-of-type').should(
          'contain',
          mainItem.name
        );
      });
    });
  });
});
