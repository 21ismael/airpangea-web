export default function convertToAP(id) {
    let idStr = id.toString();
    
    let ceros = "0".repeat(3 - idStr.length);
    
    return "AP" + ceros + idStr;
}