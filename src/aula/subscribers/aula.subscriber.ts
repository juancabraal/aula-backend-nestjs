import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
import { Aula } from '../entities/aula.entity';
import { UtilService } from '../../utils/utils.service';

@EventSubscriber()
export class AulaSubscriber implements EntitySubscriberInterface<Aula> {
    private currentModuloId: number;

    constructor(connection: Connection, private utilService: UtilService) {
        connection.subscribers.push(this);
    }

    sendRequest() {
        if (this.currentModuloId !== null)
            this.utilService.populateModulo(this.currentModuloId);

        this.currentModuloId = null;
    }

    listenTo() {
        return Aula;
    }

    beforeInsert(event: InsertEvent<Aula>) {
        this.currentModuloId = event.entity.moduloId;
    }

    afterInsert() {
        this.sendRequest();
    }

    afterRemove() {
        this.sendRequest();
    }

    afterUpdate() {
        this.sendRequest();
    }
}
