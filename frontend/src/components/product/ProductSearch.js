import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import Loader from ".././layouts/Loader";
import MetaData from ".././layouts/MetaData";
import Product from ".././product/Product";
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination';
import { useParams } from "react-router-dom";
import Slider from "rc-slider";
import Tooltip from 'rc-tooltip';
import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

export default function ProductSearch() {
    const dispatch = useDispatch();
    const { products, loading, error, productsCount, resPerPage } = useSelector((state) => state.productsState);
    const [currentPage, setCurrentPage] = useState(1);
    const [price, setPrice] = useState([1, 1000]);
    const [priceChanged, setPriceChanged] = useState(price);
    const [category, setCategory] = useState(null);
    const [rating, setRating] = useState(0);
    const { keyword } = useParams();

    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo);
    }

    useEffect(() => {
        if (error) {
            return toast.error(error, {
                position: toast.POSITION.BOTTOM_CENTER
            });
        }
        dispatch(getProducts(keyword, priceChanged, category, rating, currentPage));
    }, [error, dispatch, currentPage, keyword, priceChanged, category, rating]);

    const categoriesAndTypes = {
        'Gold': ['Ring', 'Earring', 'Bracelet', 'Bangle', 'kadas', 'Chain', 'Mangalyam', 'Necklace', 'Haram'],
        'Silver': ['Ring', 'Earring', 'Bracelet', 'Chain', 'kolusu'],
        'Diamond': ['Ring', 'Earring', 'Nosepin', 'Necklace'],
        'Gift': ['God statue', 'Vizhaku', 'Pen', 'Pendant', 'Mugappu']
    };

    const handleCategorySelect = (selectedCategory) => {
        setCategory(selectedCategory);
        setPriceChanged([1, 50000]); // Reset price filter when category changes
    }

    return (
        <Fragment>
            {loading ? <Loader /> :
                <Fragment>
                    <MetaData title={'Buy Best Products'} />
                    <h1 id="products_heading">Search Products</h1>
                    <section id="products" className="container mt-5">
                        <div className="row">
                            <div className="col-6 col-md-3 mb-5 mt-5">
                                <div className="px-5" onMouseUp={() => setPriceChanged(price)}>
                                    {/* Price Filter */}
                                    <Slider
                                        range={true}
                                        marks={{ 1: "$1", 50000: "$50000" }}
                                        min={1}
                                        max={50000}
                                        defaultValue={price}
                                        onChange={(price) => { setPrice(price); }}
                                        handleRender={(renderProps) => {
                                            return (
                                                <Tooltip overlay={`$${renderProps.props['aria-valuenow']}`}>
                                                    <div {...renderProps.props}></div>
                                                </Tooltip>
                                            );
                                        }}
                                    />
                                </div>
                                <hr className="my-5" />
                                <div className="mt-5">
                                    {/* Category Filter */}
                                    <h3 className="mb-3">Categories</h3>
                                    <ul className="pl-0">
                                        {Object.keys(categoriesAndTypes).map(category => (
                                            <li
                                                key={category}
                                                style={{ cursor: "pointer", listStyleType: "none" }}
                                                onClick={() => handleCategorySelect(category)}
                                            >
                                                {category}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            <div className="col-6 col-md-9">
                                <div className="row">
                                    {products && products.map(product => (
                                        <Product col={4} key={product._id} product={product} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                    {productsCount > 0 && productsCount > resPerPage &&
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination
                                activePage={currentPage}
                                onChange={setCurrentPageNo}
                                totalItemsCount={productsCount}
                                itemsCountPerPage={resPerPage}
                                nextPageText={'Next'}
                                firstPageText={'First'}
                                lastPageText={'Last'}
                                itemClass={'page-item'}
                                linkClass={'page-link'}
                            />
                        </div>
                    }
                </Fragment>
            }
        </Fragment>
    )
}
