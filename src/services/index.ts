export interface Service {
  bootstrap() : Promise<void>;
  shutdown() : Promise<void>;
}
