namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class CambiosEnPersonal : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GEN.cat_UnidadOrganizacional", "IdUbicacion", "GEN.cat_UbicacionAreas");
            DropForeignKey("GEN.cat_Personas", "UbicacionAreaId", "GEN.cat_UbicacionAreas");
            DropIndex("GEN.cat_Personas", new[] { "UbicacionAreaId" });
            DropIndex("GEN.cat_UnidadOrganizacional", new[] { "IdUbicacion" });
            AddColumn("GEN.cat_Personas", "Localizacion", c => c.String(maxLength: 200));
            AddColumn("GEN.cat_Personas", "plazaTrabajo", c => c.String(maxLength: 20));
            AddColumn("GEN.cat_Personas", "Extension", c => c.String(maxLength: 5));
            AddColumn("GEN.cat_Personas", "Celular", c => c.String(maxLength: 20));
            AddColumn("GEN.cat_UnidadOrganizacional", "Localizacion", c => c.String(maxLength: 100));
            AlterColumn("GEN.cat_Personas", "UbicacionAreaId", c => c.Int());
            AlterColumn("GEN.cat_Personas", "OrigenDatos", c => c.String(maxLength: 20));
            //CreateIndex("GEN.cat_Personas", "UbicacionAreaId");
            //AddForeignKey("GEN.cat_Personas", "UbicacionAreaId", "GEN.cat_UbicacionAreas", "UbicacionAreaId");
            DropColumn("GEN.cat_UnidadOrganizacional", "IdUbicacion");
        }
        
        public override void Down()
        {
            AddColumn("GEN.cat_UnidadOrganizacional", "IdUbicacion", c => c.Int(nullable: false));
            //DropForeignKey("GEN.cat_Personas", "UbicacionAreaId", "GEN.cat_UbicacionAreas");
            //DropIndex("GEN.cat_Personas", new[] { "UbicacionAreaId" });
            AlterColumn("GEN.cat_Personas", "OrigenDatos", c => c.String());
            AlterColumn("GEN.cat_Personas", "UbicacionAreaId", c => c.Int(nullable: false));
            DropColumn("GEN.cat_UnidadOrganizacional", "Localizacion");
            DropColumn("GEN.cat_Personas", "Celular");
            DropColumn("GEN.cat_Personas", "Extension");
            DropColumn("GEN.cat_Personas", "plazaTrabajo");
            DropColumn("GEN.cat_Personas", "Localizacion");
            CreateIndex("GEN.cat_UnidadOrganizacional", "IdUbicacion");
            CreateIndex("GEN.cat_Personas", "UbicacionAreaId");
            AddForeignKey("GEN.cat_Personas", "UbicacionAreaId", "GEN.cat_UbicacionAreas", "UbicacionAreaId", cascadeDelete: true);
            AddForeignKey("GEN.cat_UnidadOrganizacional", "IdUbicacion", "GEN.cat_UbicacionAreas", "UbicacionAreaId", cascadeDelete: true);
        }
    }
}
