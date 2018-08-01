namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class adjuntoadetalle : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("GEN.cat_Personas", "AdjuntoId", "GEN.Adjunto");
            DropIndex("GEN.cat_Personas", new[] { "AdjuntoId" });
            AddColumn("GEN.tab_DetallePersona", "AdjuntoId", c => c.Long());
            CreateIndex("GEN.tab_DetallePersona", "AdjuntoId");
            AddForeignKey("GEN.tab_DetallePersona", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
            DropColumn("GEN.cat_Personas", "AdjuntoId");
        }
        
        public override void Down()
        {
            AddColumn("GEN.cat_Personas", "AdjuntoId", c => c.Long());
            DropForeignKey("GEN.tab_DetallePersona", "AdjuntoId", "GEN.Adjunto");
            DropIndex("GEN.tab_DetallePersona", new[] { "AdjuntoId" });
            DropColumn("GEN.tab_DetallePersona", "AdjuntoId");
            CreateIndex("GEN.cat_Personas", "AdjuntoId");
            AddForeignKey("GEN.cat_Personas", "AdjuntoId", "GEN.Adjunto", "AdjuntoId");
        }
    }
}
