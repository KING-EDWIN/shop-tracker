# Deployment Guide - Shop Analyser

## 🚀 Vercel Deployment

### Prerequisites
- Node.js 18+ installed
- Vercel account (free tier available)
- Git repository access

### Step 1: Prepare for Deployment

1. **Ensure all files are committed**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Verify project structure**
   ```
   shop-analyser/
   ├── backend/
   │   ├── server.js
   │   ├── package.json
   │   └── products.json
   ├── src/
   │   ├── index.html
   │   ├── pages/
   │   ├── js/
   │   ├── styles/
   │   └── assets/
   ├── vercel.json
   ├── package.json
   └── README.md
   ```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Follow the prompts**
   - Link to existing project or create new
   - Confirm project settings
   - Wait for deployment

#### Option B: Vercel Dashboard

1. **Go to [vercel.com](https://vercel.com)**
2. **Click "New Project"**
3. **Import from GitHub**
4. **Select your repository**
5. **Configure settings:**
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `src`
   - Install Command: `npm install`
6. **Deploy**

### Step 3: Configure Environment

1. **In Vercel Dashboard:**
   - Go to Project Settings
   - Navigate to Environment Variables
   - Add: `NODE_ENV=production`

2. **Update API endpoints** (if needed)
   - Check that all API calls use relative paths
   - Verify CORS settings in server.js

### Step 4: Test Deployment

1. **Visit your deployed URL**
2. **Test key features:**
   - Dashboard loads correctly
   - Product management works
   - Analytics display properly
   - AI insights function
   - Charts render correctly

## 🔧 Configuration Options

### Custom Domain
1. **In Vercel Dashboard:**
   - Go to Project Settings
   - Navigate to Domains
   - Add your custom domain
   - Configure DNS settings

### Environment Variables
```bash
NODE_ENV=production
PORT=3000
```

### Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "src",
  "installCommand": "npm install"
}
```

## 📊 Performance Optimization

### Before Deployment
1. **Optimize images**
   - Compress product images
   - Use WebP format where possible
   - Implement lazy loading

2. **Minify assets**
   - Minify CSS and JavaScript
   - Enable gzip compression
   - Use CDN for static assets

3. **Database optimization**
   - Index frequently queried fields
   - Optimize API endpoints
   - Implement caching

### After Deployment
1. **Monitor performance**
   - Use Vercel Analytics
   - Check Core Web Vitals
   - Monitor API response times

2. **Optimize based on data**
   - Identify slow pages
   - Optimize database queries
   - Implement caching strategies

## 🛠️ Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Check Node.js version
node --version

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. API Endpoints Not Working
- Verify vercel.json routing
- Check CORS settings
- Ensure relative paths in frontend

#### 3. Charts Not Rendering
- Verify Chart.js CDN links
- Check browser console for errors
- Ensure canvas elements exist

#### 4. Static Files Not Loading
- Check file paths in HTML
- Verify vercel.json static routing
- Ensure files are committed to git

### Debug Mode
```bash
# Enable debug logging
NODE_ENV=development npm start
```

## 🔄 Updates and Maintenance

### Deploying Updates
1. **Make changes locally**
2. **Test thoroughly**
3. **Commit changes**
   ```bash
   git add .
   git commit -m "Update description"
   git push origin main
   ```
4. **Vercel auto-deploys** (if connected to GitHub)

### Database Backups
- Export products.json regularly
- Consider migrating to a proper database
- Implement automated backups

### Monitoring
- Set up Vercel Analytics
- Monitor error logs
- Track performance metrics
- Set up alerts for downtime

## 📈 Scaling Considerations

### For High Traffic
1. **Upgrade Vercel plan**
2. **Implement caching**
3. **Use CDN for static assets**
4. **Optimize database queries**

### For Multiple Locations
1. **Implement multi-tenancy**
2. **Add location-based routing**
3. **Separate data by location**
4. **Add user management**

### For Advanced Features
1. **Migrate to proper database**
2. **Implement real-time updates**
3. **Add user authentication**
4. **Implement role-based access**

## 🚨 Security Considerations

### Before Deployment
1. **Review code for vulnerabilities**
2. **Implement input validation**
3. **Add rate limiting**
4. **Secure API endpoints**

### After Deployment
1. **Enable HTTPS**
2. **Set up security headers**
3. **Monitor for attacks**
4. **Regular security updates**

## 📞 Support

### Vercel Support
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Project Support
- Create GitHub issues
- Email: support@oticfoundation.org
- Documentation: README.md

---

**Happy Deploying! 🚀**
