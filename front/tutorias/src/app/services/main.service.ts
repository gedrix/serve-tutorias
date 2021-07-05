import { environment } from '../../environments/environment';

export class MainService {
    public static apiUrl = environment.apiConfig.apiURL;
}
