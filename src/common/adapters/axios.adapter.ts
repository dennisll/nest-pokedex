import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { HttpAdapter } from "../interfaces/http-adapter.interface";


@Injectable()
export class AxiosAdapter implements HttpAdapter{

    private readonly axios: AxiosInstance;

    async get<T>(url: string): Promise<T> {
        
        try {
            const { data } = await axios.get<T>( url);
            return data;
        } catch (error) {
            throw new Error('This is a error on AxiosAdapter');
        }
    }
}