m = myo();

e = m.emg.force().mvavrg({ size: 12 });

r = e.recorder();

model = r.train({ type: 'GMM', gaussians: 3 });

beta = e.recognize({ model })
	.plot()
	.tomax();


clear();
