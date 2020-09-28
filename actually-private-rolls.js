Hooks.on('init', () => {
    game.settings.register("actually-private-rolls", "hidePrivateRolls", {
        name: "Hide Private Rolls",
        hint: "Enable this to hide Private GM Rolls unless they are GM or the one that rolled.",
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });
});

Hooks.on("createChatMessage", (app) => {
    if (game.settings.get("actually-private-rolls", "hidePrivateRolls") && !app.visible) {
        mergeObject(app.data, { "-=sound": null });
    }
});

Hooks.on('renderChatMessage', (app, html, msg) => {
    if (game.settings.get('actually-private-rolls', 'hidePrivateRolls') && !app.visible) {
        html.hide();
    }
});

Hooks.on("updateChatMessage", (message, data, diff, id) => {
    if (data.blind === false) {
        let messageLi = $(`.message[data-message-id=${data._id}]`);
        messageLi.show();
    }
});
