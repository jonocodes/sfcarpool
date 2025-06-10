// This is for storing the database mapped models. In the future maybe prisma will manage this.

export interface Dictionary<T> {
  [Key: string | number]: T;
}

export interface ElectricModel {
  [key: string]: any;
}

export interface EventInDb extends ElectricModel {
  id: number;
  label: string;
  date: Date;
  start: string;
  end: string;
  active: boolean;
  passenger: boolean;
  likelihood: number;
  location_id: number;
}

// TODO: rename to SchedulerEvent perhaps so it does not clash with JS
export interface Event {
  row: number;
  start: string;
  end: string;
  text: string;
  data: CarpoolMetadata;
  // data: Dictionary<string | number | Date>;
}

export interface CarpoolMetadata {
  entry: number;
  mode: string;
  likelihood: number;
  date: Date;
  // location_id: number;
  // id: number;
}

export interface Location extends ElectricModel {
  id: number;
  name: string;
}
