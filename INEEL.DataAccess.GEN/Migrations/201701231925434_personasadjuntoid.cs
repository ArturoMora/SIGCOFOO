namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class personasadjuntoid : DbMigration
    {
        public override void Up()
        {
            AddColumn("GEN.cat_Personas", "AdjuntoId", c => c.Long());
            CreateIndex("GEN.cat_Personas", "AdjuntoId");
            AddForeignKey("GEN.cat_Personas", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.cat_Personas", "AdjuntoId", "GEN.Adjunto");
            DropIndex("GEN.cat_Personas", new[] { "AdjuntoId" });
            DropColumn("GEN.cat_Personas", "AdjuntoId");
        }
    }
}
