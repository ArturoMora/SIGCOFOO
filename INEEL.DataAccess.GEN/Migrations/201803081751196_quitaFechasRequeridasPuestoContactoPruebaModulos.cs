namespace INEEL.DataAccess.GEN.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class quitaFechasRequeridasPuestoContactoPruebaModulos : DbMigration
    {
        public override void Up()
        {
            //AlterColumn("CR.tab_ContactosPuesto", "FechaInicio", c => c.DateTime());
            //AlterColumn("CR.tab_ContactosPuesto", "FechaFinal", c => c.DateTime());
        }
        
        public override void Down()
        {
            //AlterColumn("CR.tab_ContactosPuesto", "FechaFinal", c => c.DateTime(nullable: false));
            //AlterColumn("CR.tab_ContactosPuesto", "FechaInicio", c => c.DateTime(nullable: false));
        }
    }
}
