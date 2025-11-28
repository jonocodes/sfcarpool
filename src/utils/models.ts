// This is for storing the database mapped models. In the future maybe prisma will manage this.

import { LocalTime } from "@js-joda/core";

export interface Dictionary<T> {
  [Key: string | number]: T;
}

export interface DbModel {
  [key: string]: any;
}

export interface EventInDb extends DbModel {
  // id: string; // triplit keeps its ids outside the model, kinda
  label: string;
  date: Date;
  start: string;
  end: string;
  active: boolean;
  passenger: boolean;
  location_id: string;
}

export interface Event {
  row: number;
  start: LocalTime;
  end: LocalTime;
  text: string;
  data: Dictionary<string | number>;
}

export interface Location extends DbModel {
  id: string;
  name: string;
}
