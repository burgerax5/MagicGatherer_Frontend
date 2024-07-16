import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom';
import { getCardsOwned } from '../api/mycards/myCards';
import Card from '../components/Cards/Card';
import FilterBar from '../components/FilterComponents/FilterBar';
import Pagination from '../components/Pagination/Pagination';
import CardSkeletons from '../components/Skeletons/CardSkeletons';
import { CardOwnedResponseDTO } from '../models/MyCards/CardOwnedResponseDTO';
import '../styles/mycards.css'
import getResultsRange from '../utils/getResultsRange';
import { useDispatch, UseDispatch } from 'react-redux';
import { SetTotalCardsAction, SetTotalPagesAction, SetTotalValueAction } from '../redux/actions/actions';
import { getUsername } from '../utils/checkAuthenticated';
import CollectionDetails from '../components/MyCards/CollectionDetails';
import addCommasToNumber from '../utils/addCommasToNumber';


const MyCardsPage = () => {
    const [cardsOwned, setCardsOwned] = useState<CardOwnedResponseDTO | undefined>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [user, setUser] = useState<string | null>(getUsername());
    const [currentPage, setCurrentPage] = useState(1);
    const params = new URLSearchParams(location.search);
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            let data = await getCardsOwned(user + "?" + searchParams.toString());
            setCardsOwned(data);
        })();
    }, [searchParams]);

    useEffect(() => {
        (async () => {
            let username: string | undefined;

            params.forEach((value, key) => {
                if (key === "user" && value.length > 0) {
                    username = value
                    setUser(username);
                } else if (key === "user") {
                    setUser(getUsername());
                }
            })

            try {
                const data = await getCardsOwned(username ?? "");
                setCardsOwned(data);
                dispatch(SetTotalPagesAction(data.cardPageDTO.total_pages));
            } catch (error) {
                console.error(error);
                dispatch(SetTotalPagesAction(0));
            }
        })();
    }, []);

    useEffect(() => {
        if (cardsOwned) {
            dispatch(SetTotalCardsAction(cardsOwned.totalCardsOwned));
            dispatch(SetTotalValueAction(cardsOwned.estimatedValue));
        }
    }, [cardsOwned]);

    const { startRange, endRange } = getResultsRange(currentPage, 50, cardsOwned?.cardPageDTO?.results);

    return (
        <div className="content-wrapper">
            {user !== null ?
                <>
                    <h1>{user}'s Collection</h1>
                    <CollectionDetails />
                    <FilterBar setSearchParams={setSearchParams} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                    {cardsOwned?.cardPageDTO &&
                        <div className="card-results">
                            Results: {addCommasToNumber(startRange ?? 0)}-{addCommasToNumber(endRange ?? 0)} of {addCommasToNumber(cardsOwned.cardPageDTO.results)}
                        </div>}

                    <div className="card-grid">
                        <Suspense fallback={<CardSkeletons />}>
                            {cardsOwned ?
                                cardsOwned.cardPageDTO.cardDTOs.map(cardDTO => (
                                    <Card key={"card-" + cardDTO.id} card={cardDTO} />
                                )) :
                                <h2>No results</h2>}
                        </Suspense>
                    </div>

                    <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} />
                </>
                :
                <h1>User: {user} not found</h1>}
        </div>
    )
}

export default MyCardsPage