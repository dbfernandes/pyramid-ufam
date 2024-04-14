import React from 'react';
import styles from './Icons.module.css';

function GenericIcon({ defaultSize, children, ...props }) {
	const viewBox = `0 0 ${defaultSize[0]} ${defaultSize[1]}`;

	const { className, style, ...rest } = props;

	return (
		<div className={`${styles.icon} ${className}`} style={style} {...rest}>
			<svg viewBox={viewBox} className={`${styles.svg} ${styles.svgColor}`}>
				{children}
			</svg>
		</div>
	);
}

export function IconLogo(props: any) {
	return (
		<GenericIcon {...props} defaultSize={[127, 120]}>
			<path d="M38.37,16.19H50.89V28.88H76.58V16.22H89.1V28.93h12.84V41.47h12.51V54.29h12.82v56.89h-12.5v-1.05c0-7.75,0-15.51,0-23.27,0-.76-.19-1-1-1-1.82.06-3.64,0-5.56,0v25.26H95.72V98.77H31.85v12.4H19.31V85.9H16.47c-1,0-2,0-3,0-.57,0-.73.19-.72.74,0,1.43,0,2.86,0,4.29v20.23H.24V54.34H13V41.49H25.55V29H38.37ZM51.15,73.33a2.67,2.67,0,0,0,.06-.33c0-3.94,0-7.88,0-11.82,0-.68-.38-.62-.82-.62-3.84,0-7.67,0-11.51,0-.69,0-.82.24-.82.87,0,3.7,0,7.41,0,11.11,0,.26,0,.52,0,.8ZM76.38,60.56V73.31h13c0-.32,0-.58,0-.84,0-3.67,0-7.35,0-11,0-.69-.17-.9-.88-.9-3.78,0-7.57,0-11.35,0Z" transform="translate(-0.24 -3.37)" /><path d="M32.16,124V111.58h25V124Z" transform="translate(-0.24 -3.37)" /><path d="M70.38,124V111.56H95.32V124Z" transform="translate(-0.24 -3.37)" /><path d="M38.09,3.39c0,4.07,0,8,0,12a.69.69,0,0,1-.4.5c-4,0-8,0-12,0V3.39Z" transform="translate(-0.24 -3.37)" /><path d="M101.9,15.81H89.48V3.37H101.9Z" transform="translate(-0.24 -3.37)" />
		</GenericIcon>
	);
}