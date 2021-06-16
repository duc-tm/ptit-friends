module.exports = {
    convertToObject: (messageContainers) => {
        let messages = messageContainers.map((messageContainer) => {
            return messageContainer.message;
        });

        let messageObject = messages.reduce((allMessage, message) => {
            message = message.split(':');
            allMessage[message[0]] = message[1];
            return allMessage;
        }, {});

        return messageObject;
    }
}