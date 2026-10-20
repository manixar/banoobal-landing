
export function toEnglishDigits(value) {
    return value
        .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
        .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
}

export function normalizeMobile(value) {
    const digits = toEnglishDigits(value).replace(/\D/g, '');
    const local = digits.replace(/^(0098|98|0)/, '');
    return /^9\d{9}$/.test(local) ? `0${local}` : '';
}

// فرمت مورد نیاز API : +989xxxxxxxxx
export function toInternational(mobile) {
    return `+98${mobile.slice(1)}`;
}
