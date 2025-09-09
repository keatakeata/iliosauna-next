import React from 'react'

export function ImagePreview(props: any) {
  const { title, media, imageUrl } = props
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt=""
          style={{
            width: '40px',
            height: '40px',
            objectFit: 'cover',
            borderRadius: '4px',
            border: '1px solid #e1e3e6'
          }}
        />
      )}
      {media && !imageUrl && (
        <div style={{ width: '40px', height: '40px' }}>
          {media}
        </div>
      )}
      <span>{title}</span>
    </div>
  )
}