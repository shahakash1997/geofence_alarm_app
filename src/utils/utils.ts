import {Vibration} from "react-native";
import {LocationGeocodedAddress} from "expo-location/src/Location.types";


export function isEmptyOrBlank(str: string | null | undefined) {
    return !str || str.length === 0 || /^\s*$/.test(str);
}


export async function vibrate() {
    const ONE_SECOND_IN_MS = 1000;
    const PATTERN = [
        1 * ONE_SECOND_IN_MS,
        2 * ONE_SECOND_IN_MS,
        3 * ONE_SECOND_IN_MS,
    ];
    Vibration.vibrate(PATTERN);
}

/**
 *  [{"city": "Navi Mumbai", "country": "India", "district": "CBD Belapur", "isoCountryCode": "IN", "name": "C.B.D. Fire Brigade Station", "postalCode": "400614", "region": "Maharashtra", "street": null, "streetNumber": null, "subregion": "Konkan Division", "timezone": null}]
 * @param geocodedAddresses
 */
export function getStringAddress(geocodedAddresses: LocationGeocodedAddress[]): string {
    if (geocodedAddresses.length === 0) return '';
    else if (geocodedAddresses.length > 0) {
        const actualAddress = geocodedAddresses[0];
        let address = '';
        address += actualAddress.name + ', ';
        address += actualAddress.subregion + ' ';
        address += actualAddress.district + ` (${actualAddress.postalCode}) `;
        address += actualAddress.city + ' ';
        address += actualAddress.country + `(${actualAddress.isoCountryCode}) `;
        return address;
    } else return '';

}