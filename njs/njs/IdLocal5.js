const LocalId = {
    storageKey: 'visitorId',
    visitorId: null,

    init: function() {
        this.visitorId = this.getOrCreateVisitorId();
    },

    getOrCreateVisitorId: function() {
        let id = localStorage.getItem(this.storageKey);
        if (!id) {
            id = crypto.randomUUID();
            localStorage.setItem(this.storageKey, id);
        }
        return id;
    }
};

window.LocalId = LocalId;