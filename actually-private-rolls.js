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

Hooks.on('renderChatMessage', (app, html, msg) => {
    if (game.settings.get('actually-private-rolls', 'hidePrivateRolls') && msg.whisperTo !== "") {
        if (!game.user.isGM && game.user._id !== msg.author.data._id && msg.message.whisper.indexOf(game.user._id) === -1) {
            html.hide();
        }
    }
});

Hooks.on("updateChatMessage", (message, data, diff, id) => {
    if (data.blind === false) {
        let messageLi = $(`.message[data-message-id=${data._id}]`);
        messageLi.show();
    }
});

const ChatLog_notify = ChatLog.prototype.notify;
ChatLog.prototype.notify = function(message) {
    if (game.settings.get("actually-private-rolls", "hidePrivateRolls") && message.data.whisper && message.data.whisper.length) {
        if (message.data.whisper.filter(o => o._id === game.user._id).length === 0) {
            mergeObject(message.data, { "-=sound": null });
        }
    }
    ChatLog_notify.call(this, message);
};
