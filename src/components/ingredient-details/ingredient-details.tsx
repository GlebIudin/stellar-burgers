import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC<{ title?: string }> = ({ title }) => {
  const { ingredients, loading } = useSelector((state) => state.ingredients);
  const { id } = useParams<{ id: string }>();
  const ingredientData = useMemo(
    () => ingredients.find((ingredient) => ingredient._id === id),
    [ingredients, id]
  );

  if (loading || !ingredientData) {
    return <Preloader />;
  }

  return (
    <>
      {title && (
        <h1
          className='text text_type_main-large mt-10'
          style={{ textAlign: 'center' }}
        >
          {title}
        </h1>
      )}
      <IngredientDetailsUI ingredientData={ingredientData} />
    </>
  );
};
