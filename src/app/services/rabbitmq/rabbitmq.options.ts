import { Transport, RmqOptions } from '@nestjs/microservices';

export const rabbitMQConfig = (): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: ['amqp://localhost:5672'], // Replace with your RabbitMQ server URL
    queue: 'my_queue', // Define the queue name
    queueOptions: {
      durable: true,
    },
  },
});
