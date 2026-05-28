import React, { useEffect, useContext, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom';

import Form from '../../../shared/ui-ux/Form';
import FormButton from '../../../shared/ui-ux/FormButton';
import FormInput from '../../../shared/ui-ux/FormInput';
import useForm from '../../../shared/custom-hooks/useForm';
import OffersContext from '../../../shared/context/OffersContext';
import NewAuthContext from '../../../shared/context/AuthContext';
import BusinessContext from '../../../shared/context/BusinessContext';
import LoadingSpinner from '../../../shared/ui-ux/LoadingSpinner';

import {
  minLengthValidator,
  integerInputValidator,
  formatCurrency,
} from '../../../shared/util/validators-and-formatters';
import debugLog from '../../../shared/util/logger';

import classes from './NewOfferForm.module.css';

function NewOfferForm() {
  const history = useHistory();
  const { bid: businessId } = useParams();
  const { userData, tokenValue } = useContext(NewAuthContext);
  const { fetchBusiness } = useContext(BusinessContext);
  const { sendOffer } = useContext(OffersContext);
  const [isLoadding, setIsLoading] = useState(false);
  const [maxPrice, setMaxPrice] = useState(Infinity);

  const [formIsValid, inputChangeHandler, setFormInputs, formData] = useForm();

  useEffect(() => {
    const getBusiness = async () => {
      try {
        const fetchedBusiness = await fetchBusiness(businessId);
        setMaxPrice(fetchedBusiness.askingPrice);
        setIsLoading(false);
      } catch (error) {
        setMaxPrice(Infinity);
        setIsLoading(false);
        debugLog('Error fetching business');
      }
    };
    getBusiness(businessId);
  }, []);

  useEffect(() => {
    setFormInputs(['offerValue', 'message']);
  }, []);

  return (
    <Form>
      {isLoadding && <LoadingSpinner overlay />}
      <div className={classes.form__inputs}>
        <FormInput
          labelValue="Offer Value"
          HTMLElement="input"
          type="number"
          name="offerValue"
          validation={(value) => integerInputValidator(value, 0, maxPrice)}
          onInputChange={inputChangeHandler}
          errorMessage={`Please insert a integer positive number SMALLER than the asked price (${formatCurrency(
            maxPrice
          )})`}
          placeholder="XXX.XX"
        />

        <FormInput
          labelValue="Introduce yourself and describe your offer"
          HTMLElement="textarea"
          name="message"
          validation={(value) => minLengthValidator(value, 6)}
          onInputChange={inputChangeHandler}
          errorMessage="Description must contain at least 6 characters"
        />
      </div>
      <div className={classes.form__buttons}>
        <FormButton caution onClick={() => history.push('/')}>
          Cancel
        </FormButton>
        <FormButton
          disabled={!formIsValid}
          onClick={async () => {
            setIsLoading(true);
            await sendOffer(formData, tokenValue, businessId);
            setIsLoading(false);
            history.push(`/success/offer-sent`);
          }}
        >
          Send Offer
        </FormButton>
      </div>
    </Form>
  );
}

export default NewOfferForm;
