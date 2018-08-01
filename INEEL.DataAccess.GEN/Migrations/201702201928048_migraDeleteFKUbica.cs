namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migraDeleteFKUbica : DbMigration
    {
        public override void Up()
        {
            //**  ADD explicit drops
            DropForeignKey("GEN.cat_Personas", "IdUbicacion", "GEN.cat_UbicacionAreas");
            DropIndex("GEN.cat_Personas", new[] { "IdUbicacion" });
            //***END  profeninia ... for transparente updates

            DropForeignKey("GEN.cat_Personas", "UbicacionAreaId", "GEN.cat_UbicacionAreas");
            DropIndex("GEN.cat_Personas", new[] { "UbicacionAreaId" });
            DropColumn("GEN.cat_Personas", "UbicacionAreaId");
        }
        
        public override void Down()
        {
            AddColumn("GEN.cat_Personas", "UbicacionAreaId", c => c.Int());
            CreateIndex("GEN.cat_Personas", "UbicacionAreaId");
            AddForeignKey("GEN.cat_Personas", "UbicacionAreaId", "GEN.cat_UbicacionAreas", "UbicacionAreaId");
        }
    }
}
