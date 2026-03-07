import { assignShipmentsFirstFitDecreasing } from './assign-vehicles.util';

describe('assignShipmentsFirstFitDecreasing', () => {
    it('should assign shipments using first fit decreasing', () => {
        const shipments = [
            { id: '1', trackingCode: 'ENV-1', weight: 45 },
            { id: '2', trackingCode: 'ENV-2', weight: 32.5 },
            { id: '3', trackingCode: 'ENV-3', weight: 20 },
            { id: '4', trackingCode: 'ENV-4', weight: 70 },
            { id: '5', trackingCode: 'ENV-5', weight: 55 },
        ];

        const result = assignShipmentsFirstFitDecreasing(shipments, 100);

        expect(result.totalVehiclesUsed).toBe(3);
        expect(result.totalWeight).toBe(222.5);

        expect(result.vehicles[0].shipments.map((s) => s.trackingCode)).toEqual([
            'ENV-4',
            'ENV-3',
        ]);
        expect(result.vehicles[0].totalWeight).toBe(90);
        expect(result.vehicles[0].remainingCapacity).toBe(10);

        expect(result.vehicles[1].shipments.map((s) => s.trackingCode)).toEqual([
            'ENV-5',
            'ENV-1',
        ]);
        expect(result.vehicles[1].totalWeight).toBe(100);
        expect(result.vehicles[1].remainingCapacity).toBe(0);

        expect(result.vehicles[2].shipments.map((s) => s.trackingCode)).toEqual([
            'ENV-2',
        ]);
        expect(result.vehicles[2].totalWeight).toBe(32.5);
        expect(result.vehicles[2].remainingCapacity).toBe(67.5);
    });

    it('should throw an error when a shipment exceeds vehicle capacity', () => {
        const shipments = [{ id: '1', trackingCode: 'ENV-1', weight: 120 }];

        expect(() =>
            assignShipmentsFirstFitDecreasing(shipments, 100),
        ).toThrow('Shipment ENV-1 exceeds vehicle capacity');
    });
});
