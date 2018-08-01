namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class cambioPersona : DbMigration
    {
        public override void Up()
        {
            //CreateTable(
            //    "GEN.cat_TipoContrato",
            //    c => new
            //        {
            //            ContratoId = c.String(nullable: false, maxLength: 5),
            //            Descripcion = c.String(),
            //            Estado = c.Int(nullable: false),
            //        })
            //    .PrimaryKey(t => t.ContratoId);
            
            //AddColumn("GEN.cat_Personas", "TipoContratoId", c => c.String(maxLength: 5));
            //AddColumn("GEN.cat_Personas", "OrigenDatos", c => c.String());
            //CreateIndex("GEN.cat_Personas", "TipoContratoId");
            //AddForeignKey("GEN.cat_Personas", "TipoContratoId", "GEN.cat_TipoContrato", "ContratoId");
        }
        
        public override void Down()
        {
            DropForeignKey("GEN.cat_Personas", "TipoContratoId", "GEN.cat_TipoContrato");
            DropIndex("GEN.cat_Personas", new[] { "TipoContratoId" });
            DropColumn("GEN.cat_Personas", "OrigenDatos");
            DropColumn("GEN.cat_Personas", "TipoContratoId");
            DropTable("GEN.cat_TipoContrato");
        }
    }
}
