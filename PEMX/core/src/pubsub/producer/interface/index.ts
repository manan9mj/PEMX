export interface ProducerInterface {
  run(event: any): Promise<void>;
}
