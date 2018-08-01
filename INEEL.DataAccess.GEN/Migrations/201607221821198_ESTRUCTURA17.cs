namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ESTRUCTURA17 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GEN.cat_UnidadOrganizacional", "padre", "GEN.cat_UnidadOrganizacional");
            DropForeignKey("GEN.cat_Personas", "ClaveUnidad", "GEN.cat_UnidadOrganizacional");
            DropIndex("GEN.cat_Personas", new[] { "ClaveUnidad" });
            DropIndex("GEN.cat_UnidadOrganizacional", new[] { "padre" });
            DropPrimaryKey("GEN.cat_UnidadOrganizacional");
            AlterColumn("GEN.cat_Personas", "ClaveUnidad", c => c.String(maxLength: 10));
            AlterColumn("GEN.cat_UnidadOrganizacional", "ClaveUnidad", c => c.String(nullable: false, maxLength: 10));
            AlterColumn("GEN.cat_UnidadOrganizacional", "padre", c => c.String(maxLength: 10));
            AddPrimaryKey("GEN.cat_UnidadOrganizacional", "ClaveUnidad");
            CreateIndex("GEN.cat_Personas", "ClaveUnidad");
            CreateIndex("GEN.cat_UnidadOrganizacional", "padre");
            AddForeignKey("GEN.cat_UnidadOrganizacional", "padre", "GEN.cat_UnidadOrganizacional", "ClaveUnidad");
            AddForeignKey("GEN.cat_Personas", "ClaveUnidad", "GEN.cat_UnidadOrganizacional", "ClaveUnidad");
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.cat_Personas", "ClaveUnidad", "GEN.cat_UnidadOrganizacional");
            DropForeignKey("GEN.cat_UnidadOrganizacional", "padre", "GEN.cat_UnidadOrganizacional");
            DropIndex("GEN.cat_UnidadOrganizacional", new[] { "padre" });
            DropIndex("GEN.cat_Personas", new[] { "ClaveUnidad" });
            DropPrimaryKey("GEN.cat_UnidadOrganizacional");
            AlterColumn("GEN.cat_UnidadOrganizacional", "padre", c => c.String(maxLength: 128));
            AlterColumn("GEN.cat_UnidadOrganizacional", "ClaveUnidad", c => c.String(nullable: false, maxLength: 128));
            AlterColumn("GEN.cat_Personas", "ClaveUnidad", c => c.String(maxLength: 128));
            AddPrimaryKey("GEN.cat_UnidadOrganizacional", "ClaveUnidad");
            CreateIndex("GEN.cat_UnidadOrganizacional", "padre");
            CreateIndex("GEN.cat_Personas", "ClaveUnidad");
            AddForeignKey("GEN.cat_Personas", "ClaveUnidad", "GEN.cat_UnidadOrganizacional", "ClaveUnidad");
            AddForeignKey("GEN.cat_UnidadOrganizacional", "padre", "GEN.cat_UnidadOrganizacional", "ClaveUnidad");
        }
    }
}
