import { HttpService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const cheerio = require('cheerio');

export class UtilService {
    private configService: ConfigService = new ConfigService();
    private httpService: HttpService = new HttpService();

    private GetYoutubeVideoID(url: string) {
        const filteredUrl = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(filteredUrl);

        return match && match[2].length === 11 ? match[2] : '';
    }

    private GetVimeoVideoID(url: string) {
        const filteredUrl = /^.*(vimeo\.com\/)((channels\/[A-z]+\/)|(groups\/[A-z]+\/videos\/))?([0-9]+)/;
        const match = url.match(filteredUrl);

        return match && match[5].length > 0 ? match[5] : '';
    }

    public GetVideoThumbnail(url: string) {
        if (url.includes('youtube') || url.includes('youtu.be')) {
            const videoID = this.GetYoutubeVideoID(url);

            return `https://img.youtube.com/vi/${videoID}/maxresdefault.jpg`;
        } else if (url.includes('vimeo')) {
            const videoID = this.GetVimeoVideoID(url);

            return `https://i.vimeocdn.com/video/${videoID}.jpg`;
        }
    }

    public shortString(str: string, maxLen: number, separator: string = ' ') {
        if (str.length <= maxLen) return str;
        return str.substr(0, str.lastIndexOf(separator, maxLen));
    }

    public getImageFromHtml(html: string) {
        const $ = cheerio.load(html);

        const images = $('img');

        if (images.length > 0) {
            const image = images.first().attr('src');

            return image;
        }

        return '';
    }

    public veryModuloIdExist(id: number) {
        if (id !== NaN) {
            const moduloUrl = this.configService.get('MODULO_URL');

            return this.httpService
                .get(`http://${moduloUrl}/api/modulo/id/${id}`)
                .toPromise();
        }

        throw new Error('Id inválido');
    }

    public populateModulo(moduloId: number) {
        const moduloUrl = this.configService.get('MODULO_URL');

        return this.httpService
            .post(`http://${moduloUrl}/api/modulo/${moduloId}/populate`, {})
            .toPromise();
    }
}
