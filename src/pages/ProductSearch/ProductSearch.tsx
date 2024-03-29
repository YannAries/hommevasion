import { useEffect, useState, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap/";
import ProductScreenTemplate from "components/templates/ProductscreenTemplate/ProductScreenTemplate";
import ProductCard from "components/molecules/ProductCard/ProductCard";
import { useLocation } from "react-router-dom";
import SearchFilter from "./SearchFilter";
import api from "services/api";
import { urlConst } from "utilities/constants";
import ThreeDots from "components/atoms/Loaders/ThreeDots";

const categoryOptions = ["Homme", "Femme"];
const brandOptions = ["Roadster", "Puma", "HRX", "Adidas", "Flying Machine"];
const discountOptions = ["5", "15", "30"];
const deliveryOptions = ["24 heures", "3 jours", "1 semaine"];

const ProductSearch: React.FC<{}> = () => {
  const initialRender = useRef(true);
  const [loading, setLoading] = useState<boolean>(true);
  const qs = require("qs");
  const location = useLocation();

  const [products, setProducts] = useState<any[]>([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string[]>(
    []
  );

  useEffect(() => {
    if (initialRender.current) return;

    updateStatesFromQueryString();
  }, [location]);

  useEffect(() => {
    if (initialRender.current) return;

    const queryString = getQueryStringFromStates();
    window.history.pushState({}, "", "/search" + queryString);

    getProductsUsingAPI(queryString);
  }, [
    globalSearch,
    selectedCategories,
    selectedBrands,
    selectedDiscounts,
    selectedDeliveryTime,
  ]);

  useEffect(() => {
    if (location.search) updateStatesFromQueryString();
    else getProductsUsingAPI("");

    initialRender.current = false;
  }, []);

  const getProductsUsingAPI = (queryString = "") => {
    setLoading(true);
    console.log("GET -- ", urlConst.PRODUCTS + queryString);
    api.get(urlConst.PRODUCTS + queryString).then(
      (res) => {
        setProducts(res.data);
        setLoading(false);
      },
      (error) => {
        console.error("Article par filtre", error.toString());
        setLoading(false);
      }
    );
  };

  const getQueryStringFromStates = () => {
    let queryString = "?";

    if (globalSearch) queryString += `q=${globalSearch}`;
    selectedCategories.forEach(
      (gender) => (queryString += `&category=${gender}`)
    );
    selectedBrands.forEach((brand) => (queryString += `&brand=${brand}`));
    selectedDiscounts.forEach(
      (discount) => (queryString += `&discount=${discount}`)
    );
    selectedDeliveryTime.forEach(
      (delivery) => (queryString += `&deliveryTime=${delivery}`)
    );

    return queryString;
  };

  const updateStatesFromQueryString = () => {
    const qsArr = qs.parse(location.search, { ignoreQueryPrefix: true });

    Object.keys(qsArr).forEach((key) => {
      switch (key.toUpperCase()) {
        case "Q":
          setGlobalSearch(qsArr[key]);
          break;

        case "CATEGORY":
          const validGenders = getValidArray(categoryOptions, qsArr, key);
          setSelectedCategories([...validGenders]);
          break;

        case "BRAND":
          const validBrands = getValidArray(brandOptions, qsArr, key);
          setSelectedBrands([...validBrands]);
          break;

        case "DISCOUNT":
          const validDiscounts = getValidArray(discountOptions, qsArr, key);
          setSelectedDiscounts([...validDiscounts]);
          break;

        case "DELIVERYTIME":
          const validDeliveryTime = getValidArray(discountOptions, qsArr, key);
          setSelectedDiscounts([...validDeliveryTime]);
          break;

        default:
          break;
      }
    });
  };

  const getValidArray = (
    optionsArr: string[],
    qsArr: any,
    key: string
  ): string[] => {
    if (typeof qsArr[key] === "string") {
      const qsValue = qsArr[key];
      if (optionsArr.indexOf(qsValue) >= 0) {
        return [qsValue];
      } else {
        return [];
      }
    } else {
      const arr = [...qsArr[key]];
      const validArr = arr.map((ele: any) => {
        if (optionsArr.indexOf(ele) >= 0) return ele;
      });
      return [...validArr];
    }
  };
  return (
    <ProductScreenTemplate>
      <Container>
        <Row>
          <Col sm={2}>
            <br />
            <h5>Articles trouvés : {products.length}</h5>
            <br />
            <SearchFilter
              heading={"Categorie"}
              options={categoryOptions}
              selection={selectedCategories}
              onSelectionChange={setSelectedCategories}
            />
            <br />
            <SearchFilter
              heading={"Marque"}
              options={brandOptions}
              selection={selectedBrands}
              onSelectionChange={setSelectedBrands}
            />
            <br />
            <SearchFilter
              heading={"Remise"}
              options={discountOptions}
              selection={selectedDiscounts}
              onSelectionChange={setSelectedDiscounts}
              optionSuffix="%"
            />
            <br />
            <SearchFilter
              heading={"Délai de livraison"}
              options={deliveryOptions}
              selection={selectedDeliveryTime}
              onSelectionChange={setSelectedDeliveryTime}
            />
          </Col>

          <Col>
            <Row>
              {loading && <ThreeDots />}
              {!loading && !products.length && (
                <Col>Aucun article correspondant.</Col>
              )}

              {!loading &&
                products.map((product: any) => (
                  <Col sm={3} key={product.id}>
                    <ProductCard product={product} />
                  </Col>
                ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </ProductScreenTemplate>
  );
};

export default ProductSearch;
