import { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { SalesList } from '../components/SalesList';
import SalesModal from '../components/SalesModal';

export const Sales = () => {
	const [openSaleModal, setOpenSaleModal] = useState(false);

	return (
		<>
			<Grid container spacing={2}>
				<Grid item size={8}>
					<SalesList />
				</Grid>
				<Grid item size={4}>
					<Button
						size="large"
						sx={{ width: "100%", alignItems: "center" }}
						variant="contained"
						color="success"
						onClick={() => setOpenSaleModal(true)}
					>
						Adicionar venda
					</Button>
				</Grid>
			</Grid>
			<SalesModal
				open={openSaleModal}
				onClose={() => setOpenSaleModal(false)}
				onSave={() => setOpenSaleModal(false)}
				products={[{ id: 1, name: 'Product 1', price: 100 }, { id: 2, name: 'Product 2', price: 200 }]}
			></SalesModal>
		</>
	);
};

export default Sales;