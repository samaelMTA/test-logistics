export interface AssignableShipment {
    id: string;
    trackingCode: string;
    weight: number;
}

export interface VehicleAssignmentItem {
    shipmentId: string;
    trackingCode: string;
    weight: number;
}

export interface VehicleAssignment {
    vehicleNumber: number;
    shipments: VehicleAssignmentItem[];
    totalWeight: number;
    remainingCapacity: number;
}

export interface AssignVehiclesResult {
    vehicles: VehicleAssignment[];
    totalVehiclesUsed: number;
    totalWeight: number;
}

export function assignShipmentsFirstFitDecreasing(
    shipments: AssignableShipment[],
    vehicleCapacity: number,
): AssignVehiclesResult {
    const sortedShipments = [...shipments].sort((a, b) => b.weight - a.weight);

    const vehicles: VehicleAssignment[] = [];

    for (const shipment of sortedShipments) {
        if (shipment.weight > vehicleCapacity) {
            throw new Error(
                `Shipment ${shipment.trackingCode} exceeds vehicle capacity`,
            );
        }

        let assigned = false;

        for (const vehicle of vehicles) {
            if (vehicle.totalWeight + shipment.weight <= vehicleCapacity) {
                vehicle.shipments.push({
                    shipmentId: shipment.id,
                    trackingCode: shipment.trackingCode,
                    weight: shipment.weight,
                });
                vehicle.totalWeight += shipment.weight;
                vehicle.remainingCapacity = Number(
                    (vehicleCapacity - vehicle.totalWeight).toFixed(2),
                );
                assigned = true;
                break;
            }
        }

        if (!assigned) {
            vehicles.push({
                vehicleNumber: vehicles.length + 1,
                shipments: [
                    {
                        shipmentId: shipment.id,
                        trackingCode: shipment.trackingCode,
                        weight: shipment.weight,
                    },
                ],
                totalWeight: shipment.weight,
                remainingCapacity: Number((vehicleCapacity - shipment.weight).toFixed(2)),
            });
        }
    }

    const totalWeight = sortedShipments.reduce(
        (sum, shipment) => sum + shipment.weight,
        0,
    );

    return {
        vehicles,
        totalVehiclesUsed: vehicles.length,
        totalWeight: Number(totalWeight.toFixed(2)),
    };
}
