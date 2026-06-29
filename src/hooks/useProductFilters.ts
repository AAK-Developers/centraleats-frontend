import { useMemo, useState, useEffect } from "react";
import type { Product } from "./useAllProducts";

export type SortOption = "relevancia" | "precio_asc" | "precio_desc" | "nombre_az" | "recientes";

export interface PriceRange {
    min: number;
    max: number;
}

export interface ProductFiltersState {
    priceRange: PriceRange;
    vendorIds: string[];
    onlyAvailable: boolean;
    sortBy: SortOption;
}

const DEFAULT_FILTERS: ProductFiltersState = {
    priceRange: { min: 0, max: 0 },
    vendorIds: [],
    onlyAvailable: false,
    sortBy: "relevancia",
};

const PAGE_SIZE = 12;

interface UseProductFiltersOptions {
    products: Product[];
    searchFiltered: Product[];
}

export function useProductFilters({ products, searchFiltered }: UseProductFiltersOptions) {
    const priceBounds = useMemo(() => {
        if (products.length === 0) return { min: 0, max: 0 };
        const prices = products.map((p) => p.price / 100);
        return {
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices)),
        };
    }, [products]);

    const [filters, setFilters] = useState<ProductFiltersState>(DEFAULT_FILTERS);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (priceBounds.max > 0 && filters.priceRange.max === 0) {
            setFilters((f) => ({ ...f, priceRange: { ...priceBounds } }));
        }
    }, [priceBounds.max]);

    const availableVendors = useMemo(() => {
        const map = new Map<string, string>();
        products.forEach((p) => {
            if (p.vendorId && !map.has(p.vendorId)) map.set(p.vendorId, p.vendorName);
        });
        return Array.from(map, ([id, name]) => ({ id, name }));
    }, [products]);

    const filtered = useMemo(() => {
        let list = searchFiltered;

        const { priceRange, vendorIds, onlyAvailable } = filters;

        if (priceRange.max > 0) {
            list = list.filter((p) => {
                const dollars = p.price / 100;
                return dollars >= priceRange.min && dollars <= priceRange.max;
            });
        }

        if (vendorIds.length > 0) {
            list = list.filter((p) => vendorIds.includes(p.vendorId));
        }

        if (onlyAvailable) {
            list = list.filter((p) => p.isAvailable && p.stock > 0);
        }

        return list;
    }, [searchFiltered, filters]);

    const sorted = useMemo(() => {
        const list = [...filtered];
        switch (filters.sortBy) {
            case "precio_asc":
                return list.sort((a, b) => a.price - b.price);
            case "precio_desc":
                return list.sort((a, b) => b.price - a.price);
            case "nombre_az":
                return list.sort((a, b) => a.name.localeCompare(b.name));
            case "recientes":
            case "relevancia":
            default:
                return list;
        }
    }, [filtered, filters.sortBy]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));

    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [totalPages, page]);

    const paginated = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return sorted.slice(start, start + PAGE_SIZE);
    }, [sorted, page]);

    const activeFilterCount =
        (filters.vendorIds.length > 0 ? 1 : 0) +
        (filters.onlyAvailable ? 1 : 0) +
        (priceBounds.max > 0 &&
            (filters.priceRange.min > priceBounds.min || filters.priceRange.max < priceBounds.max)
            ? 1
            : 0);

    const resetFilters = () => {
        setFilters({ ...DEFAULT_FILTERS, priceRange: { ...priceBounds } });
        setPage(1);
    };

    const updateFilters = (partial: Partial<ProductFiltersState>) => {
        setFilters((f) => ({ ...f, ...partial }));
        setPage(1);
    };

    return {
        filters,
        updateFilters,
        resetFilters,
        priceBounds,
        availableVendors,
        activeFilterCount,
        results: paginated,
        totalResults: sorted.length,
        page,
        totalPages,
        setPage,
    };
}