document.addEventListener('DOMContentLoaded', async () => {
    // Cargar enlaces al inicio
    LocalId.init();
    TransactionTable.init();
    InfoCards.init();
    await LinksModule.loadLinksFromJSON();
    const session = await MyApp.Session.check();

    if (!session.logged_in) {
        LoginHandler.showLoginForm();
    } else {
        FormHandler.showClaimForm(session); // Pasamos sesión directamente
        AccountHandler.showAccountInfoIfLoggedIn(session);
    }
});