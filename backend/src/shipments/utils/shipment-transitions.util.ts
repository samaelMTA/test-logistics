import { ShipmentStatus } from '../../common/enums/shipment-status.enum';

export const allowedTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
    [ShipmentStatus.CREATED]: [
        ShipmentStatus.IN_WAREHOUSE,
        ShipmentStatus.CANCELLED,
    ],
    [ShipmentStatus.IN_WAREHOUSE]: [
        ShipmentStatus.IN_TRANSIT,
        ShipmentStatus.RETURNED,
        ShipmentStatus.CANCELLED,
    ],
    [ShipmentStatus.IN_TRANSIT]: [
        ShipmentStatus.OUT_FOR_DELIVERY,
        ShipmentStatus.RETURNED,
        ShipmentStatus.CANCELLED,
    ],
    [ShipmentStatus.OUT_FOR_DELIVERY]: [
        ShipmentStatus.DELIVERED,
        ShipmentStatus.RETURNED,
        ShipmentStatus.CANCELLED,
    ],
    [ShipmentStatus.DELIVERED]: [],
    [ShipmentStatus.RETURNED]: [
        ShipmentStatus.CANCELLED,
    ],
    [ShipmentStatus.CANCELLED]: [],
};

export function isValidShipmentTransition(
    currentStatus: ShipmentStatus,
    nextStatus: ShipmentStatus,
): boolean {
    return allowedTransitions[currentStatus]?.includes(nextStatus) ?? false;
}