namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migraGenerica : DbMigration
    {
        public override void Up()
        {
            //CreateTable(
            //    "CR.cat_TituloPersona",
            //    c => new
            //        {
            //            TituloId = c.Int(nullable: false, identity: true),
            //            Nombre = c.String(nullable: false, maxLength: 250),
            //            Descripcion = c.String(maxLength: 300),
            //            FechaRegistro = c.String(nullable: false),
            //            Autor = c.String(nullable: false),
            //            Estado = c.Boolean(nullable: false),
            //        })
            //    .PrimaryKey(t => t.TituloId);
            
            //AddColumn("CR.cat_Contactos", "TituloId", c => c.Int());
            //CreateIndex("CR.cat_Contactos", "TituloId");
            //AddForeignKey("CR.cat_Contactos", "TituloId", "CR.cat_TituloPersona", "TituloId");
        }
        
        public override void Down()
        {
            //DropForeignKey("CR.cat_Contactos", "TituloId", "CR.cat_TituloPersona");
            //DropIndex("CR.cat_Contactos", new[] { "TituloId" });
            //DropColumn("CR.cat_Contactos", "TituloId");
            //DropTable("CR.cat_TituloPersona");
        }
    }
}
