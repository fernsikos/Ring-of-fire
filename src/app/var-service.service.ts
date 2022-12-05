import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VarServiceService {

  constructor() { }

  public choosedGender: string = 'male';
  public playerName:string;
}
