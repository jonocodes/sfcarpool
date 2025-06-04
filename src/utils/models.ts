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

export interface Event {
  row: number;
  start: string;
  end: string;
  text: string;
  data: Dictionary<string | number>;
}

export interface Location extends ElectricModel {
  id: number;
  name: string;
}
