import { Suspense, useEffect, useState } from 'react'
import getCardsInPage from '../api/cards/getCards'
import FilterBar from '../components/FilterComponents/FilterBar'
import CardSkeletons from '../components/Skeletons/CardSkeletons'
import { CardPageDTO } from '../models/Cards/CardPageDTO'
import '../styles/cards.css'
import { useSearchParams, useNavigate } from "react-router-dom"
import Pagination from '../components/Pagination/Pagination'
import Card from '../components/Cards/Card'
import { useDispatch } from 'react-redux'
import { SetTotalPagesAction } from '../redux/actions/actions'

const AllCardsPage = () => {
    const [cardPageDTO, setCardPageDTO] = useState<CardPageDTO | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const getResultsRange = (currentPage: number, resultsPerPage: number, totalResults: number | undefined) => {
        if (!totalResults) return {}

        const startRange = (currentPage - 1) * resultsPerPage + 1;
        const endRange = Math.min(currentPage * resultsPerPage, totalResults);
        return { startRange, endRange };
    };

    useEffect(() => {
        (async () => {
            let page = await getCardsInPage(searchParams.toString());
            setCardPageDTO(page);
            // navigate("");
        })();
    }, [searchParams]);

    useEffect(() => {
        const totalPages = cardPageDTO?.total_pages;
        dispatch(SetTotalPagesAction(totalPages ?? 0));
    }, [cardPageDTO])

    const { startRange, endRange } = getResultsRange(currentPage, 50, cardPageDTO?.results);

    return (
        <div className="content-wrapper">
            <h1>Cards</h1>
            <FilterBar setSearchParams={setSearchParams} currentPage={currentPage} setCurrentPage={setCurrentPage} />
            {cardPageDTO && <div>Results: {startRange} - {endRange} of {cardPageDTO?.results}</div>}
            <div className="card-grid">
                <Suspense fallback={<CardSkeletons />}>
                    {cardPageDTO?.results ?
                        cardPageDTO.cardDTOs.map(cardDTO => (
                            <Card key={"card-" + cardDTO.id} card={cardDTO} />
                        )) :
                        <h2>No results</h2>}
                </Suspense>
            </div>
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
    )
}

export default AllCardsPage