import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import ShapePreview from './ShapePreview.tsx';
import { generateBlob, uploadDisabled } from '../../utils';
import type { BlobProps } from '../../types.ts';

interface Props {
    setLastMutationTime?: Dispatch<SetStateAction<number>>;
}

export default function NewShape(props: Props) {
    const { setLastMutationTime } = props;
    const [blobData, setBlobData] = useState<BlobProps | undefined>({
        parameters: {
            name: 'innocent-narwhal-902',
            color: '#000000',
            size: 200, // 根据需要调整大小
            // 添加其他必要的参数
        },
        // 其他属性
    });
    const [wasUploaded, setWasUploaded] = useState<boolean>(false);

    // 定义形状参数的状态
    const [shapeParameters, setShapeParameters] = useState<BlobProps['parameters']>({
        name: 'innocent-narwhal-902',
        color: '#000000',
        size: 200, // 默认大小
        // 根据需要添加更多参数
    });

    // 预设形状列表，包括 "innocent-narwhal-902"
    const presetShapes: BlobProps['parameters'][] = [
        { name: 'Innocent Narwhal', color: '#0000FF', size: 200 }, // "innocent-narwhal-902" 的参数
        { name: 'Circle', color: '#FF0000', size: 100 },
        { name: 'Square', color: '#00FF00', size: 150 },
        { name: 'Triangle', color: '#FFA500', size: 120 },
        // 添加更多预设
    ];

    // 随机生成形状（保留以供需要时使用）
    const randomizeBlob = () => {
        const randomBlob = generateBlob();
        setBlobData(randomBlob);
        setShapeParameters(randomBlob.parameters);
        setWasUploaded(false);
    };

    // 处理表单输入变化
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setShapeParameters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 生成形状数据
    const generateShape = () => {
        const newBlob: BlobProps = {
            parameters: shapeParameters,
            // 根据需要添加其他属性
        };
        setBlobData(newBlob);
        setWasUploaded(false);
    };

    // 上传形状
    const uploadBlob = async () => {
        if (!blobData) return;

        try {
            const response = await fetch('/api/blobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blobData.parameters)
            });
            const data = await response.json();
            if (data.message) {
                console.log(data.message);
            }
            setWasUploaded(true);
            if (setLastMutationTime) {
                setLastMutationTime(Date.now());
            }
        } catch (error) {
            console.error('Error uploading blob:', error);
        }
    };

    // 按钮禁用逻辑
    const isUploadDisabled = uploadDisabled || wasUploaded || !blobData;

    return (
        <>
            <h2 className="mb-4 text-xl text-center sm:text-xl">New Shape</h2>
            <div className="w-full bg-transparent rounded-lg mb-6 p-4 relative">
                {/* 叠加矢量图 */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {/* 这里可以放置你的矢量图，如 SVG 或图片 */}
                    <img 
                        src="intelligence-future-wiki/public/images/spider.jpg" 
                        alt="Overlay Graphic" 
                        className="w-full h-full object-contain"
                    />
                </div>
                <form onSubmit={(e) => { e.preventDefault(); generateShape(); }}>
                    {/* 预设形状选择 */}
                    <div className="mb-4">
                        <label className="block text-neutral-900 mb-2" htmlFor="preset">Preset Shapes</label>
                        <select
                            id="preset"
                            name="preset"
                            onChange={(e) => {
                                const selectedPreset = presetShapes.find(p => p.name === e.target.value);
                                if (selectedPreset) {
                                    setShapeParameters(selectedPreset);
                                    setBlobData({ parameters: selectedPreset });
                                }
                            }}
                            value={shapeParameters.name}
                            className="w-full px-3 py-2 border rounded"
                            required
                        >
                            <option value="">-- Select a Preset --</option>
                            {presetShapes.map(preset => (
                                <option key={preset.name} value={preset.name}>
                                    {preset.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* 形状名称 */}
                    <div className="mb-4">
                        <label className="block text-neutral-900 mb-2" htmlFor="name">Shape Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={shapeParameters.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    {/* 颜色选择 */}
                    <div className="mb-4">
                        <label className="block text-neutral-900 mb-2" htmlFor="color">Color</label>
                        <input
                            type="color"
                            id="color"
                            name="color"
                            value={shapeParameters.color}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    {/* 大小输入 */}
                    <div className="mb-4">
                        <label className="block text-neutral-900 mb-2" htmlFor="size">Size</label>
                        <input
                            type="number"
                            id="size"
                            name="size"
                            value={shapeParameters.size}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border rounded"
                            min={10}
                            max={500}
                            required
                        />
                    </div>
                    {/* 根据需要添加更多输入字段 */}
                    <div className="flex flex-wrap justify-center gap-4">
                        <button type="button" className="btn btn-secondary" onClick={randomizeBlob}>
                            Randomize
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Generate Shape
                        </button>
                    </div>
                </form>
                {blobData && (
                    <div className="mt-6 aspect-square text-primary">
                        <ShapePreview {...blobData} />
                    </div>
                )}
            </div>
            <div className="flex flex-wrap justify-center gap-4">
                <button className="btn btn-primary" onClick={uploadBlob} disabled={isUploadDisabled}>
                    Upload
                </button>
            </div>
        </>
    }