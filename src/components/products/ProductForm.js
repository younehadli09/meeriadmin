'use client';
import axios from 'axios';
import { Card, Button } from 'flowbite-react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
export default function ProductForm({ initialData }) {
    const [step, setStep] = useState(1);
    const [name, setName] = useState(initialData?.name || '');
    const [description, setDescription] = useState('');
    const [richDescription, setRichDescription] = useState('');
    const [Price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [CountINStock, setCountINStock] = useState('');
    const [brand, setBrand] = useState('');
    const [IsFeatured, setIsFeatured] = useState(false);
    const [images, setImages] = useState([]);
    const [productdetail, setProductDetail] = useState([{ color: '', sizes: [{ size: '', stock: '' }] }]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name || '');
            setDescription(initialData.description || '');
            setRichDescription(initialData.richDescription || '');
            setPrice(initialData.Price || '');
            setCategory(initialData.category || '');
            setCountINStock(initialData.CountINStock || '');
            setBrand(initialData.brand || '');
            setIsFeatured(initialData.IsFeatured || false);
            setImages(initialData.images || []);
            setProductDetail(initialData.productdetail || [{ color: '', sizes: [{ size: '', stock: '' }] }]);
        }
    }, [initialData]);
    useEffect(() => {
        axios
            .post(`${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/categories/categoryGET`, {
                query: `
                    query {
                        CategoryGET {
                            _id
                            name
                        }
                    }
                `,
            })
            .then((response) => {
                setCategories(response.data.data.CategoryGET);
            })
            .catch((error) => {
                console.error('Error fetching categories:', error);
            });
    }, []);

    const nextStep = (e) => {
        e.preventDefault();
        setStep((prev) => prev + 1);
    };

    const prevStep = (e) => {
        e.preventDefault();
        setStep((prev) => prev - 1);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [...images];

        files.forEach(file => {
            if (!newImages.some(img => img.name === file.name)) {
                if (file.size <= 5 * 1024 * 1024) { // Max 5MB per image
                    newImages.push(file);
                } else {
                    console.error('File too large:', file.name);
                }
            }
        });

        if (newImages.length > 5) {
            console.error('Cannot select more than 5 images');
            return;
        }

        setImages(newImages);
    };

    const removeImage = (index) => {
        setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };


    const handleProductDetailChange = (index, field, value) => {
        const newProductDetails = [...productdetail];
        newProductDetails[index][field] = value;
        setProductDetail(newProductDetails);
    };

    const handleSizeChange = (detailIndex, sizeIndex, field, value) => {
        const newProductDetails = [...productdetail];
        newProductDetails[detailIndex].sizes[sizeIndex][field] = value;
        setProductDetail(newProductDetails);
    };

    const addNewProductDetail = () => {
        setProductDetail([...productdetail, { color: '', sizes: [{ size: '', stock: '' }] }]);
    };

    const addNewSize = (index) => {
        const newProductDetails = [...productdetail];
        newProductDetails[index].sizes.push({ size: '', stock: '' });
        setProductDetail(newProductDetails);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !Price || isNaN(Price)) {
            setError('Please fill out all fields and ensure the price is a valid number.');
            return;
        }

        setError(null);
        setLoading(true);

        const formattedProductDetail = productdetail.map((detail) => ({
            color: detail.color,
            sizes: detail.sizes.map((size) => ({
                size: size.size,
                stock: size.stock,
            })),
        }));

        const formData = new FormData();
        images.forEach((image) => {
            formData.append("images", image);
        });

        formData.append('name', name);
        formData.append('description', description);
        formData.append('richDescription', richDescription);
        formData.append('Price', Price);
        formData.append('category', category);
        formData.append('CountINStock', CountINStock);
        formData.append('brand', brand);
        formData.append('IsFeatured', IsFeatured);
        formData.append('productdetail', JSON.stringify(formattedProductDetail));

        try {
            const token = localStorage.getItem('authtoken');
            if (initialData) {
                // EDIT PRODUCT
                await axios.put(
                    `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/products/${initialData._id}`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else {
                // CREATE PRODUCT
                await axios.post(
                    `${process.env.NEXT_PUBLIC_IPHOST}/StoreAPI/products/CreateProduct`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }
            location.href = '/products';
        } catch (err) {
            console.error('Error:', err.message);
            setError('Failed to save product.');
        } finally {
            setLoading(false);
        }
    };

    return (

        <Card className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full max-w-3xl bg-transparent relative">
            <h1 className="text-2xl font-bold mb-4">
                {initialData ? 'Edit Product' : 'Create New Product'}
            </h1>
            {error && <p className="text-red-500">{error}</p>}

            {step === 1 && (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Step 1: Basic Product Info</h1>
                    <div className="form-row mb-3">
                        <label>Product Name</label>
                        <input className="form-input" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="form-row mb-3">
                        <label>Description</label>
                        <input className="form-input" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="form-row mb-3">
                        <label>Rich Description</label>
                        <input className="form-input" type="text" value={richDescription} onChange={(e) => setRichDescription(e.target.value)} />
                    </div>
                    <div className="form-row mb-3">
                        <label>Photos</label>
                        <input className="form-input" type="file" multiple onChange={handleFileChange} />

                        {/* Show Image Previews */}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {images.map((img, index) => (
                                <div key={index} className="relative">
                                    <Image
                                        src={URL.createObjectURL(img)}
                                        alt="Preview"
                                        className="w-20 h-20 object-cover rounded border"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                        onClick={() => removeImage(index)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="form-row mb-3">
                        <label>Price</label>
                        <input className="form-input" type="number" value={Price} onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className="form-row mb-3">
                        <label>Category</label>
                        <select
                            className="form-select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-row mb-3">
                        <label>Count In Stock</label>
                        <input
                            className="form-input"
                            type="number"
                            value={CountINStock}
                            onChange={(e) => setCountINStock(e.target.value)}
                        />
                    </div>
                    <div className="form-row mb-3">
                        <label>Brand</label>
                        <input className="form-input" type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
                    </div>
                    <div className="form-row mb-3">
                        <label>Featured</label>
                        <select className="form-select" value={IsFeatured} onChange={(e) => setIsFeatured(e.target.value)}>
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <Button className="btn-primary w-full" type="button" onClick={nextStep}>
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Step 2: Select Colors and Sizes</h1>
                    {productdetail.map((detail, detailIndex) => (
                        <div key={detailIndex} className="mb-4">
                            <div className="form-row mb-2">
                                <label>Color</label>
                                <input
                                    className="form-input"
                                    type="text"
                                    value={detail.color}
                                    onChange={(e) => handleProductDetailChange(detailIndex, 'color', e.target.value)}
                                />
                            </div>
                            {detail.sizes.map((size, sizeIndex) => (
                                <div key={sizeIndex} className="form-row mb-2 flex gap-2">
                                    <input
                                        className="form-input"
                                        type="text"
                                        placeholder="Size"
                                        value={size.size}
                                        onChange={(e) => handleSizeChange(detailIndex, sizeIndex, 'size', e.target.value)}
                                    />
                                    <input
                                        className="form-input"
                                        type="number"
                                        placeholder="Stock"
                                        value={size.stock}
                                        onChange={(e) => handleSizeChange(detailIndex, sizeIndex, 'stock', e.target.value)}
                                    />
                                </div>
                            ))}
                            <Button className="btn-primary w-full mb-2" type="button" onClick={() => addNewSize(detailIndex)}>
                                Add Size
                            </Button>
                        </div>
                    ))}
                    <Button className="btn-primary w-full mb-4" type="button" onClick={addNewProductDetail}>
                        Add Another Color
                    </Button>
                    <div className="form-row flex justify-between">
                        <Button className="btn-primary w-1/2 mr-2" type="button" onClick={prevStep}>
                            Back
                        </Button>
                        <Button className="btn-primary w-1/2" type="submit" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Creating...' : 'Create Product'}
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}





