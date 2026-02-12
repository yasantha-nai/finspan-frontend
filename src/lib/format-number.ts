// Number formatting utilities for dashboard displays

export function fNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
}

export function fPercent(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
}

export function fShortenNumber(value: number): string {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
    }
    return fNumber(value);
}

export function fCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}
