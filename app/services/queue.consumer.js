import amqp from "amqplib";

const queue = "PRODUCTS_UPDATE";

(async () => {
    try {
        connection = await amqp.connect("amqps://tpdwjofe:qnMlEn3H7rAgjpD_kNwF2rToYInzDOdM@tough-cobalt-boar.rmq6.cloudamqp.com/tpdwjofe");
        const channel = await connection.createChannel();

        process.once("SIGINT", async () => {
            await channel.close();
            await connection.close();
        });

        await channel.assertQueue(queue, { durable: false });
        await channel.consume(
            queue,
            (message) => {
                if (message) {
                    console.log(
                        " [x] Received '%s'",
                        JSON.parse(message.content.toString())
                    );
                }
            },
            { noAck: true }
        );

        console.log(" [*] Waiting for messages. To exit press CTRL+C");
    } catch (err) {
        console.warn(err);
    }
})();