import { ShipmentStatus } from '../../common/enums/shipment-status.enum';
import { isValidShipmentTransition } from './shipment-transitions.util';

describe('isValidShipmentTransition', () => {
    it('should allow a valid transition', () => {
        expect(
            isValidShipmentTransition(
                ShipmentStatus.CREATED,
                ShipmentStatus.IN_WAREHOUSE,
            ),
        ).toBe(true);
    });

    it('should reject an invalid transition', () => {
        expect(
            isValidShipmentTransition(
                ShipmentStatus.CREATED,
                ShipmentStatus.DELIVERED,
            ),
        ).toBe(false);
    });
});