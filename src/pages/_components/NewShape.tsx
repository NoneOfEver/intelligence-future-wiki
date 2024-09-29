import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import ShapePreview from './ShapePreview.tsx';
import { generateBlob, uploadDisabled } from '../../utils';
import type { BlobProps } from '../../types.ts';

interface Props {
    setLastMutationTime?: Dispatch<SetStateAction<number>>;
}

export default function NewShape(props: Props) {
    const { setLastMutationTime } = props;
    const [blobData, setBlobData] = useState<BlobProps>();
    const [wasUploaded, setWasUploaded] = useState<boolean>(false);

    const randomizeBlob = () => {
        setBlobData(generateBlob());
        setWasUploaded(false);
    };

    const uploadBlob = async () => {
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
        setLastMutationTime(Date.now());
    };

    useEffect(() => {
        if (!blobData) {
            randomizeBlob();
        }
    }, [blobData]);

    return (
        <>
            <div className="w-full bg-transparent rounded-lg mb-6 relative">
                {/* 叠加矢量图 */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
                    {/* 替换为您的矢量图路径 */}
                    <img 
                        src="intelligence-future-wiki/public/images/spider.jpg"
                        alt="Overlay Graphic" 
                        className="w-full h-full object-contain" 
                    />
                </div>
                
                {/* 主要内容 */}
                <h2 className="mb-4 text-xl text-center sm:text-xl">spider</h2>
                <div className="p-4 aspect-square text-primary">
                    {blobData && <ShapePreview {...blobData} />}
                </div>
            </div>
        </>
    );
}
