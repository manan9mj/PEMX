# Product Events Message Exchange (PEMX)
Scalable and Resilient Event-Based Message Exchange for Real-Time Product Information Updates.

Utilizing the powers of Kafka to manage these events.

## Assumption
Source Data Provider is a Product Information System, running in On-premise Datacenters. Using a tool like Kafka Connect, PEMX can consume events from this system.

## Handling Events
Below are the categories of events coming from the source system. These events will be further processed and distributed(or made available) by PEMX for the downstream systems which can be in multiple geographic regions and then persisted in DB to keep track of what happened over time for a specific product ID.
- Product Price Update
- Country
- Specific Product Discount Update

## Systems in PEMX
There are two Node.js servers -
- Distribution Server -
  - Events from the source system will be consumed here by Kafka and then published to the various Kafka Topics(queue) on which the concerned downstream system is listening.
  - One of the Kafka topics will also be listened by the web server to store all of the events consumed by this server in DB. (or perform any analytics before storing).
- Web Server -
  - Listening to all the events consumed by the distribution server
  - WebApp and downstream systems can fetch the history of events against a set of product IDs.
  - Fallback API to push events to the same Kafka topic on which the distribution server is listening so that events can be distributed to the downstream system in case of source system failures.
- WebApp -
  - Users can see the history of distributed events against a set of product IDs.
  - Users can dump an array of events which will call the Fallback API to push events.
- Also refer to `design.draw.io` file For system design graphic.

## Managing Events By Kafka
- [KafkaJS](https://www.npmjs.com/package/kafkajs) - Apache Kafka client for Node.js
- We can assume it's a multi-region Kafka cluster.
### Kafka Topics (queues) involved in PEMX
  - `product-event`
    - Source system is pushing all of the events on this topic, this is being listened by PEMX distribution server.
  - `product-price-update-v1-{region}`
    - Pushing events of type `Product Price Update version 1` for a specific `region` on this topic by the PEMX distribution server, this is being listened by the concerned downstream system.
  - `country-{country}`
    - Pushing events of type `Country` for a specific `country` on this topic by the PEMX distribution server, this is being listened by the concerned downstream system.
  - `specific-product-discount-update-{region}`
    - Pushing events of type `Specific Product Discount Update` for a specific `region` on this topic by PEMX distribution server, this is being listened by the concerned downstream system.
  - `product-event-storage-pemx`
    - Distribution system is pushing all the events on this topic, this is being listened by PEMX web server to store events in the database.
### Kafka Consumer Groups involved in PEMX
  - `product-event-storage-consumer-pemx`
    - Events from the topic `product-event-storage-pemx` are being listened by this consumer group ID in the web server.
  - `product-event-consumer-pemx`
    - Events from the topic `product-event` are being listened by this consumer group ID in the distribution server.
 
## Other Features
- Generalized retrial mechanism for various network calls.
- Extensive logging for quick troubleshooting.
- Gracefully shutting down the server. Delay before exiting the process after terminating/interrupting the server so that all pending events or logs can be processed or any other clean-up tasks can be performed.
- Error Handling, validations.

## Future Scope
- Alerting, CI/CD Pipelines, Unit Testing, Kubernetes for auto-scaling, Multi-user Auth, Analytics, etc

## Steps to setup
### Running Kafka using [docker image](https://kafka.apache.org/quickstart#:~:text=kraft/server.properties-,Using%20docker%20image,-Get%20the%20docker)
Get the docker image
```
$ docker pull apache/kafka:3.7.1
```
Start the kafka docker container
```
$ docker run -p 9092:9092 apache/kafka:3.7.1
```

### Run PEMX systems
Open a new terminal, run the web server
```
cd PEMX/core
npm i
npm run dev:web-server
```

Open a new terminal, run the distribution server
```
cd PEMX/core
npm run dev:dis-server
```

Open a new terminal, run webapp
```
cd PEMX/webapp
npm run i
npm run start
```

### Mock Events
The Mock directory contains the scripts for generating events with random data and it also behaves as a mock producer and consumer of events in the same Kafka cluster and Topics.
This can also act as `Performance Testing` script.
Open a new terminal, run the mock server
```
cd Mock
npm run start
```


### Screenshots from the WebApp
![image](https://github.com/user-attachments/assets/c4d8aa79-893d-4032-a81c-d7820b32f67c)
![Screenshot 2024-07-26 144117](https://github.com/user-attachments/assets/9e558e02-ee84-4f9d-ae78-87682d4b7c53)
![Screenshot 2024-07-26 144333](https://github.com/user-attachments/assets/ffd11f39-6324-4a0b-9ac6-68ebd9e1c9b3)
![Screenshot 2024-07-26 144433](https://github.com/user-attachments/assets/5f09d860-4561-4242-b159-b09c2f10fb2f)
![Screenshot 2024-07-26 144532](https://github.com/user-attachments/assets/7837c6f7-3d65-4b3d-8c5e-c755c6397d6c)


