// @ts-nocheck
import { observer } from "mobx-react";
import { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { ratingStore } from "../store/RatingStore";

/**
 * @fileoverview Rating Control component using React Bootstrap.
 * Displays 1-10 star/number selection.
 * @param {object} props
 * @param {string} props.tconst - Movie ID
 * @param {number} [props.initialRating]
 */
const RatingControlBase = ({ tconst, initialRating = 0 }) => {
    const [hoverValue, setHoverValue] = useState(0);
    const [selectedValue, setSelectedValue] = useState(initialRating);
    const [userId, setUserId] = useState(null);

    // Get User ID on mount
    useState(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            try { setUserId(JSON.parse(stored).id || JSON.parse(stored).userId); }
            catch (e) { }
        }
    });

    if (!userId) return null; // Hide if not logged in

    const handleRate = (val) => {
        setSelectedValue(val);
        ratingStore.rateTitle(userId, tconst, val);
    };

    return (
        <div className="d-flex align-items-center gap-2">
            <span className="text-white small">Rate:</span>
            <ButtonGroup size="sm">
                {[...Array(10)].map((_, i) => {
                    const val = i + 1;
                    const isActive = val <= (hoverValue || selectedValue);
                    return (
                        <Button
                            key={val}
                            variant={isActive ? "warning" : "outline-secondary"}
                            className="p-1 px-2"
                            style={{ fontSize: '0.8rem', lineHeight: 1 }}
                            onMouseEnter={() => setHoverValue(val)}
                            onMouseLeave={() => setHoverValue(0)}
                            onClick={() => handleRate(val)}
                            disabled={ratingStore.isLoading}
                        >
                            ★
                        </Button>
                    );
                })}
            </ButtonGroup>
            {ratingStore.isLoading && <span className="text-muted small">Saving...</span>}
        </div>
    );
};

export const RatingControl = observer(RatingControlBase);
